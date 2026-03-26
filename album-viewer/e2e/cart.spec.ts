import { test, expect } from '@playwright/test'

const mockAlbums = [
  {
    id: 1,
    title: 'Test Album One',
    artist: 'Artist One',
    price: 9.99,
    image_url: 'https://via.placeholder.com/300x300/667eea/white?text=Album+1',
  },
  {
    id: 2,
    title: 'Test Album Two',
    artist: 'Artist Two',
    price: 14.99,
    image_url: 'https://via.placeholder.com/300x300/764ba2/white?text=Album+2',
  },
  {
    id: 3,
    title: 'Test Album Three',
    artist: 'Artist Three',
    price: 12.49,
    image_url: 'https://via.placeholder.com/300x300/ff4757/white?text=Album+3',
  },
]

test.beforeEach(async ({ page }) => {
  // Mock the /albums API endpoint
  await page.route('/albums', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockAlbums),
    })
  })

  await page.goto('/')
  // Wait for albums to load
  await page.waitForSelector('.albums-grid')

  // Clear localStorage after page loads (so it doesn't persist across tests,
  // but doesn't interfere with the module's initial load)
  await page.evaluate(() => {
    localStorage.removeItem('album-viewer-cart')
  })

  // Force a re-render by reloading after clearing localStorage
  await page.reload()
  await page.waitForSelector('.albums-grid')
})

test.describe('Cart Icon in Header', () => {
  test('displays cart icon in the header', async ({ page }) => {
    const cartBtn = page.locator('.cart-icon-btn')
    await expect(cartBtn).toBeVisible()
  })

  test('cart badge is hidden when cart is empty', async ({ page }) => {
    const badge = page.getByTestId('cart-badge')
    await expect(badge).not.toBeVisible()
  })

  test('cart badge shows correct count after adding an album', async ({ page }) => {
    const addButtons = page.getByTestId('add-to-cart-btn')
    await addButtons.first().click()
    const badge = page.getByTestId('cart-badge')
    await expect(badge).toBeVisible()
    await expect(badge).toHaveText('1')
  })

  test('cart badge updates in real-time as albums are added', async ({ page }) => {
    const addButtons = page.getByTestId('add-to-cart-btn')
    await addButtons.nth(0).click()
    await addButtons.nth(1).click()

    const badge = page.getByTestId('cart-badge')
    await expect(badge).toHaveText('2')
  })
})

test.describe('Add to Cart', () => {
  test('clicking "Add to Cart" changes button to "In Cart"', async ({ page }) => {
    const firstAddBtn = page.getByTestId('add-to-cart-btn').first()
    await expect(firstAddBtn).toHaveText('Add to Cart')
    await firstAddBtn.click()
    await expect(firstAddBtn).toHaveText('✓ In Cart')
  })

  test('"In Cart" button is disabled to prevent duplicates', async ({ page }) => {
    const firstAddBtn = page.getByTestId('add-to-cart-btn').first()
    await firstAddBtn.click()
    await expect(firstAddBtn).toBeDisabled()
  })

  test('can add multiple different albums to cart', async ({ page }) => {
    const addButtons = page.getByTestId('add-to-cart-btn')
    await addButtons.nth(0).click()
    await addButtons.nth(1).click()
    await addButtons.nth(2).click()

    const badge = page.getByTestId('cart-badge')
    await expect(badge).toHaveText('3')
  })
})

test.describe('Cart Drawer', () => {
  test('cart drawer is hidden initially', async ({ page }) => {
    const drawer = page.getByTestId('cart-drawer')
    await expect(drawer).not.toBeVisible()
  })

  test('clicking cart icon opens the drawer', async ({ page }) => {
    await page.locator('.cart-icon-btn').click()
    const drawer = page.getByTestId('cart-drawer')
    await expect(drawer).toBeVisible()
  })

  test('empty cart shows appropriate message', async ({ page }) => {
    await page.locator('.cart-icon-btn').click()
    await expect(page.getByText('Your cart is empty')).toBeVisible()
  })

  test('cart drawer shows added album details', async ({ page }) => {
    // Add first album to cart
    await page.getByTestId('add-to-cart-btn').first().click()

    // Open cart
    await page.locator('.cart-icon-btn').click()
    const drawer = page.getByTestId('cart-drawer')
    await expect(drawer).toBeVisible()

    // Verify album details are shown
    await expect(drawer.getByText('Test Album One')).toBeVisible()
    await expect(drawer.getByText('Artist One')).toBeVisible()
    await expect(drawer.locator('.cart-item-price').filter({ hasText: '$9.99' })).toBeVisible()
  })

  test('cart total is calculated correctly', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').nth(0).click()
    await page.getByTestId('add-to-cart-btn').nth(1).click()

    await page.locator('.cart-icon-btn').click()

    const total = page.getByTestId('cart-total')
    // 9.99 + 14.99 = 24.98
    await expect(total).toHaveText('$24.98')
  })

  test('close button dismisses the cart drawer', async ({ page }) => {
    await page.locator('.cart-icon-btn').click()
    await expect(page.getByTestId('cart-drawer')).toBeVisible()

    await page.getByRole('button', { name: 'Close cart' }).click()
    await expect(page.getByTestId('cart-drawer')).not.toBeVisible()
  })

  test('clicking overlay closes the cart drawer', async ({ page }) => {
    await page.locator('.cart-icon-btn').click()
    await expect(page.getByTestId('cart-drawer')).toBeVisible()

    // Click on the overlay (outside the drawer)
    await page.getByTestId('cart-overlay').click({ position: { x: 10, y: 10 } })
    await expect(page.getByTestId('cart-drawer')).not.toBeVisible()
  })
})

test.describe('Remove from Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').nth(0).click()
    await page.getByTestId('add-to-cart-btn').nth(1).click()
    await page.locator('.cart-icon-btn').click()
    await expect(page.getByTestId('cart-drawer')).toBeVisible()
  })

  test('each cart item has a remove button', async ({ page }) => {
    const removeButtons = page.getByRole('button', { name: 'Remove from cart' })
    await expect(removeButtons).toHaveCount(2)
  })

  test('removing an album updates the cart count badge', async ({ page }) => {
    await expect(page.getByTestId('cart-badge')).toHaveText('2')

    const removeButtons = page.getByRole('button', { name: 'Remove from cart' })
    await removeButtons.first().click()

    await expect(page.getByTestId('cart-badge')).toHaveText('1')
  })

  test('removing an album updates the total price', async ({ page }) => {
    // Initial total: 9.99 + 14.99 = 24.98
    await expect(page.getByTestId('cart-total')).toHaveText('$24.98')

    // Remove first item (9.99)
    const removeButtons = page.getByRole('button', { name: 'Remove from cart' })
    await removeButtons.first().click()

    // New total: 14.99
    await expect(page.getByTestId('cart-total')).toHaveText('$14.99')
  })

  test('removing last album shows empty cart message', async ({ page }) => {
    const removeButtons = page.getByRole('button', { name: 'Remove from cart' })
    await removeButtons.first().click()
    await removeButtons.first().click()

    await expect(page.getByText('Your cart is empty')).toBeVisible()
    await expect(page.getByTestId('cart-badge')).not.toBeVisible()
  })

  test('removed album "Add to Cart" button is re-enabled', async ({ page }) => {
    // Close drawer
    await page.getByRole('button', { name: 'Close cart' }).click()

    // First album should show "✓ In Cart" (disabled)
    const firstAddBtn = page.getByTestId('add-to-cart-btn').first()
    await expect(firstAddBtn).toHaveText('✓ In Cart')
    await expect(firstAddBtn).toBeDisabled()

    // Re-open cart and remove first album
    await page.locator('.cart-icon-btn').click()
    const removeButtons = page.getByRole('button', { name: 'Remove from cart' })
    await removeButtons.first().click()
    await page.getByRole('button', { name: 'Close cart' }).click()

    // First album "Add to Cart" button should now be enabled again
    await expect(firstAddBtn).toHaveText('Add to Cart')
    await expect(firstAddBtn).not.toBeDisabled()
  })
})

test.describe('Clear Cart', () => {
  test('clear cart button removes all items', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').nth(0).click()
    await page.getByTestId('add-to-cart-btn').nth(1).click()

    await page.locator('.cart-icon-btn').click()
    await page.getByText('Clear Cart').click()

    await expect(page.getByText('Your cart is empty')).toBeVisible()
    await expect(page.getByTestId('cart-badge')).not.toBeVisible()
  })
})

test.describe('Cart Persistence', () => {
  test('cart state persists after page reload', async ({ page }) => {
    // Add albums
    await page.getByTestId('add-to-cart-btn').nth(0).click()
    await page.getByTestId('add-to-cart-btn').nth(1).click()

    await expect(page.getByTestId('cart-badge')).toHaveText('2')

    // Reload the page (keeping localStorage; route mock persists across navigations)
    await page.reload()
    await page.waitForSelector('.albums-grid')

    // Badge should still show 2
    await expect(page.getByTestId('cart-badge')).toHaveText('2')

    // "In Cart" state should be preserved
    const addButtons = page.getByTestId('add-to-cart-btn')
    await expect(addButtons.nth(0)).toHaveText('✓ In Cart')
    await expect(addButtons.nth(1)).toHaveText('✓ In Cart')
  })
})
