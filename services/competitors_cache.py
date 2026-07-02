from datetime import (
    datetime,
    timedelta
)

from database.collections import (
    competitor_cache_collection
)


CACHE_DAYS = 15


async def get_cached_competitor(
    competitor: str
):

    cache = await competitor_cache_collection.find_one(

        {

            "competitor":
            competitor

        }

    )

    if cache is None:

        return None

    if datetime.utcnow() > cache["expires_at"]:

        await competitor_cache_collection.delete_one(

            {

                "_id":
                cache["_id"]

            }

        )

        return None

    cache.pop("_id", None)
    cache.pop("cached_at", None)
    cache.pop("expires_at", None)

    return cache


async def save_cached_competitor(

    competitor: str,

    data: dict

):

    document = {

        "competitor":
        competitor,

        **data,

        "cached_at":
        datetime.utcnow(),

        "expires_at":
        datetime.utcnow() + timedelta(
            days=CACHE_DAYS
        )

    }

    await competitor_cache_collection.insert_one(
        document
    )