#include <iostream>
#include <vector>
#include <ctime>
#include <string>
#include <sstream>
#include <iomanip>
#include <openssl/sha.h>
#include <nlohmann/json.hpp>
#include <cpprest/http_listener.h>
#include <cpprest/json.h>

using namespace web;
using namespace web::http;
using namespace web::http::experimental::listener;
using json = nlohmann::json;

class Block {
public:
    int index;
    std::string timestamp;
    int proof;
    std::string previous_hash;

    Block(int idx, const std::string& ts, int p, const std::string& ph) 
        : index(idx), timestamp(ts), proof(p), previous_hash(ph) {}

    json to_json() const {
        return {
            {"index", index},
            {"timestamp", timestamp},
            {"proof", proof},
            {"previous_hash", previous_hash}
        };
    }
};

class Blockchain {
private:
    std::vector<Block> chain;
    
    std::string sha256(const std::string str) {
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        SHA256_Update(&sha256, str.c_str(), str.size());
        SHA256_Final(hash, &sha256);
        
        std::stringstream ss;
        for(int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
            ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
        }
        return ss.str();
    }

public:
    Blockchain() {
        create_block(1, "0");
    }

    Block create_block(int proof, const std::string& previous_hash) {
        time_t now = time(0);
        std::string dt = ctime(&now);
        dt.pop_back(); // remove newline
        
        Block block(chain.size() + 1, dt, proof, previous_hash);
        chain.push_back(block);
        return block;
    }

    Block get_previous_block() {
        return chain.back();
    }

    int proof_of_work(int previous_proof) {
        int new_proof = 1;
        bool check_proof = false;
        
        while (!check_proof) {
            std::string operation = std::to_string(new_proof * new_proof - previous_proof * previous_proof);
            std::string hash_operation = sha256(operation);
            
            if (hash_operation.substr(0, 5) == "00000") {
                check_proof = true;
            } else {
                new_proof++;
            }
        }
        
        return new_proof;
    }

    std::string hash(const Block& block) {
        json block_json = block.to_json();
        return sha256(block_json.dump());
    }

    bool is_chain_valid(const std::vector<Block>& chain) {
        Block previous_block = chain[0];
        int block_index = 1;
        
        while (block_index < chain.size()) {
            Block block = chain[block_index];
            if (block.previous_hash != hash(previous_block)) {
                return false;
            }
            
            int previous_proof = previous_block.proof;
            int proof = block.proof;
            std::string operation = std::to_string(proof * proof - previous_proof * previous_proof);
            std::string hash_operation = sha256(operation);
            
            if (hash_operation.substr(0, 5) != "00000") {
                return false;
            }
            
            previous_block = block;
            block_index++;
        }
        
        return true;
    }

    const std::vector<Block>& get_chain() const {
        return chain;
    }
};

int main() {
    Blockchain blockchain;
    http_listener listener("http://localhost:5000");

    listener.support(methods::GET, [&blockchain](http_request request) {
        auto path = request.relative_uri().path();
        
        if (path == "/mine_block") {
            Block previous_block = blockchain.get_previous_block();
            int previous_proof = previous_block.proof;
            int proof = blockchain.proof_of_work(previous_proof);
            std::string previous_hash = blockchain.hash(previous_block);
            Block block = blockchain.create_block(proof, previous_hash);
            
            json response = {
                {"message", "A block is MINED"},
                {"index", block.index},
                {"timestamp", block.timestamp},
                {"proof", block.proof},
                {"previous_hash", block.previous_hash}
            };
            
            request.reply(status_codes::OK, response);
        }
        else if (path == "/get_chain") {
            json response = {
                {"chain", json::array()},
                {"length", blockchain.get_chain().size()}
            };
            
            for (const auto& block : blockchain.get_chain()) {
                response["chain"].push_back(block.to_json());
            }
            
            request.reply(status_codes::OK, response);
        }
        else if (path == "/valid") {
            bool valid = blockchain.is_chain_valid(blockchain.get_chain());
            json response;
            
            if (valid) {
                response = {{"message", "The Blockchain is valid."}};
            } else {
                response = {{"message", "The Blockchain is not valid."}};
            }
            
            request.reply(status_codes::OK, response);
        }
        else {
            request.reply(status_codes::NotFound);
        }
    });

    try {
        listener.open().wait();
        std::cout << "Listening for requests at: http://localhost:5000" << std::endl;
        std::cin.get();
        listener.close().wait();
    }
    catch (const std::exception & e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    return 0;
}