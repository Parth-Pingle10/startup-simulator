from playwright.sync_api import sync_playwright
from urllib.parse import quote


def search_trustpilot(
    company_name: str
):

    search_url = (
        f"https://www.trustpilot.com/search?query={quote(company_name)}"
    )

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )

        page = browser.new_page()

        page.goto(search_url)

        page.wait_for_timeout(3000)

        links = page.locator(
            "a[href*='/review/']"
        ).all()

        if not links:

            browser.close()

            return None

        first_link = links[0]

        company_text = (
            first_link.inner_text()
            .strip()
        )

        review_url = (
            first_link.get_attribute(
                "href"
            )
        )

        if review_url.startswith("/"):

            review_url = (
                "https://www.trustpilot.com"
                + review_url
            )

        browser.close()

        return {
            "name": company_text,
            "review_url": review_url
        }
        
        
def scrape_trustpilot_reviews(
    review_url: str
):

    reviews = []

    with sync_playwright() as p:

        browser = p.chromium.launch(
            headless=True
        )

        page = browser.new_page()

        for page_num in range(1, 4):

            if page_num == 1:

                url = review_url

            else:

                url = (
                    f"{review_url}?page={page_num}"
                )

            page.goto(url)

            page.wait_for_timeout(3000)

            page_text = (
                page.locator("body")
                .inner_text()
            )

            if (
                "Page not found"
                in page_text
                or "404"
                in page_text
            ):
                break

            review_cards = page.locator(
                '[data-service-review-text-typography="true"]'
            ).all()

            for card in review_cards:

                try:

                    review_text = (
                        card.inner_text()
                        .strip()
                    )

                    if len(review_text) > 20:

                        reviews.append(
                            {
                                "text":
                                review_text,

                                "source":
                                "trustpilot"
                            }
                        )

                except:
                    pass

        browser.close()

    return reviews