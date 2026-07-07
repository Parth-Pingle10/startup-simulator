from playwright.sync_api import sync_playwright
from urllib.parse import quote
from utils.logger import logger

import re

def normalize_name(
    text: str
):

    text = text.lower()

    text = re.sub(
        r"www\.",
        "",
        text
    )

    text = re.sub(
        r"\.(com|io|ai|app|co|net)",
        "",
        text
    )

    text = re.sub(
        r"[^a-z0-9]",
        "",
        text
    )

    return text


def search_trustpilot(
    company_name: str
):

    search_url = (
        f"https://www.trustpilot.com/search?query={quote(company_name)}"
    )

    logger.info(
        f"Searching Trustpilot: {company_name}"
    )

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )
        context = browser.new_context()
         
        page = context.new_page()

        page.goto(
            search_url,
            wait_until="domcontentloaded"
        )

        page.wait_for_timeout(3000)

        links = page.locator(
            "a[href*='/review/']"
        ).all()

        logger.info(
            f"{company_name}: {len(links)} search results found."
        )

        if not links:

            browser.close()

            logger.warning(
                f"{company_name}: No Trustpilot results."
            )

            return None

        first_link = links[0]

        company_text = (
            first_link.inner_text()
            .strip()
        )

        logger.info(
            f"First Trustpilot Result:\n{company_text}"
        )

        expected = normalize_name(
            company_name
        )

        found = normalize_name(
            company_text
        )

        if expected not in found:

            logger.warning(

                f"Company mismatch.\n"
                f"Expected : {company_name}\n"
                f"Found    : {company_text}\n"
                f"Using LLM fallback."

            )

            browser.close()

            return None

        review_url = first_link.get_attribute(
            "href"
        )

        if review_url.startswith("/"):

            review_url = (
                "https://www.trustpilot.com"
                + review_url
            )

        browser.close()
        context.close()

        return {

            "name":
            company_text,

            "review_url":
            review_url

        }


def scrape_trustpilot_reviews(
    review_url: str
):

    logger.info(
        f"Scraping reviews from {review_url}"
    )

    reviews = []

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )
        
        context = browser.new_context()
        
        page = context.new_page()

        for page_num in range(1, 4):

            if page_num == 1:

                url = review_url

            else:

                url = (
                    f"{review_url}?page={page_num}"
                )

            logger.info(
                f"Opening {url}"
            )

            page.goto(
                url,
                wait_until="domcontentloaded"
            )

            page.wait_for_timeout(3000)

            page_text = (
                page.locator("body")
                .inner_text()
            )

            if (
                "Page not found" in page_text
                or "404" in page_text
            ):

                logger.warning(
                    f"{url} not found."
                )

                break

            review_cards = page.locator(
                '[data-service-review-text-typography="true"]'
            ).all()

            logger.info(
                f"Page {page_num}: {len(review_cards)} review cards found."
            )

            for card in review_cards:

                if len(reviews) >= 15:
                    break

                try:

                    review_text = (
                        card.inner_text()
                        .strip()
                    )

                    if len(review_text) > 20:

                        reviews.append({

                            "text":
                            review_text,

                            "source":
                            "trustpilot"

                        })

                except Exception:

                    pass

        browser.close()
        context.close()

    logger.info(
        f"Total reviews scraped: {len(reviews)}"
    )

    return reviews