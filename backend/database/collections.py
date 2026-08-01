from backend.database.mongo import db


class LazyCollection:
    def __init__(self, name: str):
        self._name = name

    def _resolve(self):
        return db[self._name]

    def __getattr__(self, name):
        return getattr(self._resolve(), name)


users_collection = LazyCollection("user")
analysis_collection = LazyCollection("analysis")
competitor_cache_collection = LazyCollection("cached_competitors")
logs_collection = LazyCollection("logs")
refresh_tokens_collection = LazyCollection("refresh_tokens")
otp_codes_collection = LazyCollection("otp_codes")
email_verifications_collection = LazyCollection("email_verifications")
