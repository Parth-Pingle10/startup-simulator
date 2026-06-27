from database.mongo import db

users_collection = db["user"]

analysis_collection = db["analysis"]

competitor_cache_collection = db["cached_competitors"]

logs_collection = db["logs"]

refresh_tokens_collection = db["refresh_tokens"]
