document.getElementById('testBtn').addEventListener('click', async () => {
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = 'Testing...';

  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (response.status !== 200) {
      resultsDiv.innerHTML = `<div class="defect">Error: Expected status 200, got ${response.status}</div>`;
      return;
    }

    const products = await response.json();
    let defects = [];

    products.forEach(product => {
      let productDefects = [];

      if (!product.title || product.title.trim() === '') {
        productDefects.push('Missing or empty title');
      }
      if (typeof product.price !== 'number' || product.price < 0) {
        productDefects.push('Negative or invalid price');
      }
      if (
        !product.rating ||
        typeof product.rating.rate !== 'number' ||
        product.rating.rate > 5
      ) {
        productDefects.push('rating.rate missing or exceeds 5');
      }

      if (productDefects.length > 0) {
        defects.push({
          id: product.id,
          title: product.title,
          defects: productDefects
        });
      }
    });

    if (defects.length === 0) {
      resultsDiv.innerHTML = `<div class="success">No defects found. All products are valid!</div>`;
    } else {
      resultsDiv.innerHTML = `<h3>Products with Defects:</h3>` +
        defects.map(d =>
          `<div class="defect">
            <strong>Product ID:</strong> ${d.id}<br>
            <strong>Title:</strong> ${d.title || '<em>Missing</em>'}<br>
            <strong>Defects:</strong>
            <ul>${d.defects.map(df => `<li>${df}</li>`).join('')}</ul>
          </div>`
        ).join('');
    }
  } catch (err) {
    resultsDiv.innerHTML = `<div class="defect">Error: ${err.message}</div>`;
  }
});