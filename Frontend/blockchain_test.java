import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import com.google.gson.Gson;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import spark.Spark;

class Block {
    private int index;
    private String timestamp;
    private int proof;
    private String previousHash;

    public Block(int index, String timestamp, int proof, String previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.proof = proof;
        this.previousHash = previousHash;
    }

    // Getters
    public int getIndex() { return index; }
    public String getTimestamp() { return timestamp; }
    public int getProof() { return proof; }
    public String getPreviousHash() { return previousHash; }
}

class Blockchain {
    private List<Block> chain;
    private Gson gson = new Gson();

    public Blockchain() {
        this.chain = new ArrayList<>();
        createBlock(1, "0");
    }

    public Block createBlock(int proof, String previousHash) {
        Block block = new Block(
            chain.size() + 1,
            new Date().toString(),
            proof,
            previousHash
        );
        chain.add(block);
        return block;
    }

    public Block getPreviousBlock() {
        return chain.get(chain.size() - 1);
    }

    public int proofOfWork(int previousProof) {
        int newProof = 1;
        boolean checkProof = false;

        while (!checkProof) {
            String hashOperation = sha256(String.valueOf(newProof * newProof - previousProof * previousProof));
            if (hashOperation.substring(0, 5).equals("00000")) {
                checkProof = true;
            } else {
                newProof++;
            }
        }

        return newProof;
    }

    public String hash(Block block) {
        String json = gson.toJson(block);
        return sha256(json);
    }

    public boolean isChainValid(List<Block> chain) {
        Block previousBlock = chain.get(0);
        int blockIndex = 1;

        while (blockIndex < chain.size()) {
            Block block = chain.get(blockIndex);
            if (!block.getPreviousHash().equals(hash(previousBlock))) {
                return false;
            }

            int previousProof = previousBlock.getProof();
            int proof = block.getProof();
            String hashOperation = sha256(String.valueOf(proof * proof - previousProof * previousProof));

            if (!hashOperation.substring(0, 5).equals("00000")) {
                return false;
            }
            previousBlock = block;
            blockIndex++;
        }

        return true;
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes());
            StringBuilder hexString = new StringBuilder();

            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Blockchain blockchain = new Blockchain();
        
        Spark.port(5000);
        
        Spark.get("/mine_block", (req, res) -> {
            Block previousBlock = blockchain.getPreviousBlock();
            int previousProof = previousBlock.getProof();
            int proof = blockchain.proofOfWork(previousProof);
            String previousHash = blockchain.hash(previousBlock);
            Block block = blockchain.createBlock(proof, previousHash);
            
            String response = String.format("{\"message\":\"A block is MINED\",\"index\":%d,\"timestamp\":\"%s\",\"proof\":%d,\"previous_hash\":\"%s\"}",
                block.getIndex(), block.getTimestamp(), block.getProof(), block.getPreviousHash());
            
            res.type("application/json");
            return response;
        });
        
        Spark.get("/get_chain", (req, res) -> {
            List<Block> chain = blockchain.getChain();
            String response = String.format("{\"chain\":%s,\"length\":%d}",
                new Gson().toJson(chain), chain.size());
            
            res.type("application/json");
            return response;
        });
        
        Spark.get("/valid", (req, res) -> {
            boolean valid = blockchain.isChainValid(blockchain.getChain());
            String response;
            
            if (valid) {
                response = "{\"message\":\"The Blockchain is valid.\"}";
            } else {
                response = "{\"message\":\"The Blockchain is not valid.\"}";
            }
            
            res.type("application/json");
            return response;
        });
    }
}