const deleteProduct = async btn => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrfToken = btn.parentNode.querySelector('[name=csrfToken]').value;
    const productElement = btn.closest('li');

    try {
        const response = await fetch('/cart-delete-item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: prodId,
                csrfToken: csrfToken
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        if (!data.numOfProducts) {
            window.location.href = '/cart';
            return;
        }
        productElement.parentNode.removeChild(productElement);
    }
    catch (err) {
        console.error(err);
        window.location.href = '/error';
    }
};