exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: req.query.edit
    });
};

exports.postAddProduct = async (req, res, next) => {
    try {
        await req.user.createProduct({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            imageUrl: req.body.imageUrl
        });
        res.redirect('/admin/products');
    }
    catch (err) {
        console.log(err);
    }
};

exports.getEditProduct = async (req, res, next) => {
    try {
        const products = await req.user.getProducts({ where: { id: req.params.productId } });
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            product: products[0],
            editing: req.query.edit
        });
    }
    catch (err) {
        console.log(err);
    }
};

exports.postEditProduct = async (req, res, next) => {
    try {
        const products = await req.user.getProducts({ where: { id: req.body.productId } });
        await products[0].update({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description
        });
        res.redirect('/admin/products');
    }
    catch (err) {
        console.log(err);
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        const products = await req.user.getProducts({ where: { id: req.body.productId } });
        await products[0].destroy();
        res.redirect('/admin/products');
    }
    catch (err) {
        console.log(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await req.user.getProducts();
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    }
    catch (err) {
        console.log(err);
    }
};
