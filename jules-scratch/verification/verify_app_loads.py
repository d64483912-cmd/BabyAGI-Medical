from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # 1. Navigate to the application.
        page.goto("http://localhost:3000")

        # 2. Wait for the main content to be visible.
        # This helps ensure the page is fully loaded before taking a screenshot.
        expect(page.locator("body")).to_be_visible(timeout=15000)

        # 3. Take a screenshot for visual verification.
        page.screenshot(path="jules-scratch/verification/verification.png")

        print("Screenshot taken successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        # Take a screenshot even on failure for debugging.
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        # 4. Clean up.
        context.close()
        browser.close()

with sync_playwright() as playwright:
    run(playwright)