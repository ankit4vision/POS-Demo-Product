// Simple test script for Product API endpoints
// Run this in browser console or use Postman/Insomnia

const API_BASE = 'http://localhost:8000/api';

// Test data for creating a product
const testProduct = {
  name: 'Test Product',
  sku: 'TEST001',
  barcode: '123456789',
  purchase_price: 100.00,
  sales_price: 150.00,
  retailer_sales_price: 140.00,
  individual_sales_price: 160.00,
  status: 'active'
};

// Test API endpoints
async function testProductAPI() {
  try {
    console.log('🧪 Testing Product API...');
    
    // 1. Test GET /products (List)
    console.log('\n1. Testing GET /products...');
    const listResponse = await fetch(`${API_BASE}/products`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'Content-Type': 'application/json'
      }
    });
    console.log('List Response Status:', listResponse.status);
    
    // 2. Test POST /products (Create)
    console.log('\n2. Testing POST /products...');
    const createResponse = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testProduct)
    });
    console.log('Create Response Status:', createResponse.status);
    
    if (createResponse.ok) {
      const createdProduct = await createResponse.json();
      console.log('Created Product:', createdProduct);
      
      // 3. Test GET /products/{id} (Show)
      console.log('\n3. Testing GET /products/{id}...');
      const showResponse = await fetch(`${API_BASE}/products/${createdProduct.id}`, {
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN_HERE',
          'Content-Type': 'application/json'
        }
      });
      console.log('Show Response Status:', showResponse.status);
      
      // 4. Test PUT /products/{id} (Update)
      console.log('\n4. Testing PUT /products/{id}...');
      const updateData = { ...testProduct, name: 'Updated Test Product' };
      const updateResponse = await fetch(`${API_BASE}/products/${createdProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN_HERE',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      console.log('Update Response Status:', updateResponse.status);
      
      // 5. Test DELETE /products/{id} (Delete)
      console.log('\n5. Testing DELETE /products/{id}...');
      const deleteResponse = await fetch(`${API_BASE}/products/${createdProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer YOUR_TOKEN_HERE',
          'Content-Type': 'application/json'
        }
      });
      console.log('Delete Response Status:', deleteResponse.status);
    }
    
    console.log('\n✅ Product API testing completed!');
    
  } catch (error) {
    console.error('❌ Error testing Product API:', error);
  }
}

// Run the test
// testProductAPI();

console.log('📋 Product API Test Script Loaded');
console.log('To run tests, call: testProductAPI()');
console.log('Remember to replace YOUR_TOKEN_HERE with a valid authentication token'); 