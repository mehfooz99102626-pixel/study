// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Load Properties for Admin
    async function loadAdminProperties() {
        try {
            const response = await fetch('../php/get_properties.php');
            const properties = await response.json();
            const tbody = document.querySelector('#admin-properties tbody');
            if (tbody) {
                tbody.innerHTML = properties.map(p => `
                    <tr>
                        <td>${p.id}</td>
                        <td>${p.title}</td>
                        <td>${p.location}</td>
                        <td>$${p.price.toLocaleString()}</td>
                        <td>
                            <a href="edit_property.php?id=${p.id}">Edit</a> |
                            <a href="#" onclick="deleteProperty(${p.id})">Delete</a>
                        </td>
                    </tr>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading admin properties:', error);
        }
    }

    // Delete Property
    async function deleteProperty(id) {
        if (confirm('Are you sure?')) {
            try {
                const response = await fetch(`delete_property.php?id=${id}`);
                if (response.ok) {
                    loadAdminProperties();
                }
            } catch (error) {
                console.error('Error deleting property:', error);
            }
        }
    }

    // Image Upload Preview
    const imageInput = document.getElementById('property-images');
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            const files = e.target.files;
            const preview = document.getElementById('image-preview');
            if (preview) {
                preview.innerHTML = '';
                Array.from(files).forEach(file => {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.style.width = '100px';
                    preview.appendChild(img);
                });
            }
        });
    }

    // Load on Admin Page
    if (document.getElementById('admin-properties')) {
        loadAdminProperties();
    }
});