
let nombreSubastador = ''
let productoSubasta = ''
let precioProductoSubasta
let nombreOfertante= ''
let precioOferta

const errorsContainer = document.getElementById('errors')
const btnStartSubasta = document.getElementById('btn-start-subasta')
const btnAddOffer = document.getElementById('offer')
const btnDeleteProduct = document.getElementById('delete-item')
const btnClearFilters = document.getElementById('clear-filters')
const btnSortNameAZ = document.getElementById('filter-name-az')
const btnSortNameZA = document.getElementById('filter-name-za')
const btnSortPrice19 = document.getElementById('filter-price-19')
const inputIdSubastador = document.getElementById('id-subastador')
const inputIdOfertante = document.getElementById('id-ofertante')
const btnSortPrice91 = document.getElementById('filter-price-91')
const btnBuscarNombre = document.getElementById('btn-buscar-nombre')
const inputBuscarNombre = document.getElementById('buscar-nombre')
const btnAddProductSubasta = document.getElementById('btn-submit-prod-venta')
const containerAddProduct = document.querySelector('.content-product-subasta')
const btnAddOfertante = document.getElementById('btn-submit-ofertante')
const conainterSearchResult = document.getElementById('search-result') || []
const conainterSearchBar = document.querySelector('.buscar-name')
const conainterFiltersBar = document.querySelector('.filters-btns')

const urlSubastador = 'http://localhost:3000/subastador/';
const urlOfertantes = 'http://localhost:3000/ofertantes/';

const listadoDeProduct = []
let listadoDeOfertantes = []
let sortOffersList = [...listadoDeOfertantes]

btnBuscarNombre.addEventListener('click', filterName)
btnAddOffer.addEventListener('click', showFormOfertante)
btnDeleteProduct.addEventListener('click', deleteProduct)
btnClearFilters.addEventListener('click', clearFilters)
btnStartSubasta.addEventListener('click', showProductContainerInputs)
btnAddProductSubasta.addEventListener('click', addProductSubasta)
btnAddOfertante.addEventListener('click', addNewOffer)
btnSortPrice19.addEventListener('click', sortByPriceLessMore)
btnSortPrice91.addEventListener('click', sortByPriceMoreLess)
btnSortNameAZ.addEventListener('click', sortByNameAZ)
btnSortNameZA.addEventListener('click', sortByNameZA)

const formatoMiles = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = '$1.';
    let arr = number.toString().split('.');
    arr[0] = arr[0].replace(exp,rep);
    return arr[1] ? arr.join(','): arr[0];
}
const ProductoSubasta = function(nombreProducto,nombreVendedor,precio,id) {
    this.nombre_Producto = nombreProducto.toUpperCase();
    this.nombre_Vendedor = nombreVendedor.toUpperCase();
    this.precio_Producto = precio;
    this.id = id
}
const OfertantesListado = function(nombreProducto,nombreOfertante,precio,id) {
    this.nombre_Producto = nombreProducto.toUpperCase();
    this.nombre_Ofertante = nombreOfertante.toUpperCase();
    this.precio_Oferta = precio;
    this.id = id
}
fetch(urlSubastador)
    .then(response => response.json())
    .then( (data) => {
        if(data.length < 1){
            btnStartSubasta.style.display = 'inline-block'
        } else {
            for (const [item] of Object.entries(data)) {
                let nombre = data[item].nombre
                let price = data[item].precio
                let product = data[item].producto
                let id = data[item].id

                let productoDeSubasta = new ProductoSubasta(product,nombre,price,id)
                listadoDeProduct.push(productoDeSubasta)

                let div = document.createElement('div')
                div.setAttribute('class','item-venta')
                div.innerHTML = printProductoVenta(product, nombre, price)
                document.getElementById('info-prod-venta').appendChild(div)
            }
        }

        if(listadoDeProduct.length < 1){
            document.getElementById('productoen-venta').style.display = 'none'
            btnStartSubasta.style.display = 'inline-block'
            btnAddOffer.disabled = true
            btnAddOffer.style.display = "none"
        } else {
            document.getElementById('productoen-venta').style.display = 'block'
            btnStartSubasta.style.display = 'none'
            btnAddOffer.disabled = false
            btnAddOffer.style.display = "block"
        }
    })
    .catch(() => {
        Swal.fire({
            title: "Error de Conexión",
            text: "Disculpe las molestias, estamos teniendo problemas de conxión con la base de datos",
            icon: "error"
        });
        btnStartSubasta.style.display = 'none'
    })


fetch(urlOfertantes)
    .then(response => response.json())
    .then( (data) => {

        if(data.length < 1){
            containerAddProduct.style.display = 'none'
        } else {
            for (const [item] of Object.entries(data)) {
                let nombre = data[item].nombre
                let price = data[item].precio
                let product = data[item].producto
                let id = data[item].id

                let ofertantes = new OfertantesListado(product,nombre,price,id)
                listadoDeOfertantes.push(ofertantes)

                let div = document.createElement('div');
                div.setAttribute('class','item-venta');
                div.innerHTML = printListaOferta(product, nombre, price)
                document.getElementById('container-lista').appendChild(div)
                showOptions()
            }
        }
        if(listadoDeOfertantes.length < 1){
            document.getElementById('lista-ofertantes').style.display = 'none';
        } else {
            document.getElementById('lista-ofertantes').style.display = 'block';
            document.getElementById('form-ofertantes').style.display = 'none'
        }
    })
    .catch(() => {
        Swal.fire({
            title: "Error de Conexión",
            text: "Disculpe las molestias, estamos teniendo problemas de conxión con la base de datos",
            icon: "error"
        });
    })
function sendProductToJson(nombre, producto, precio, id) {
    let json = {"nombre": nombre, "producto": producto, "precio": precio, "id": id}
    let jsonData = JSON.stringify(json)
    fetch(urlSubastador, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => response.json())
        .then( (data) => {
            let productoDeSubasta = new ProductoSubasta(data.producto,data.nombre,data.precio,data.id)
            listadoDeProduct.push(productoDeSubasta)
        })
        .catch(error => console.log(error))
}
function sendOfertanteToJson(nombre, producto, precio, id) {
    let json = {"nombre": nombre, "producto": producto, "precio": precio, "id": id}
    let jsonData = JSON.stringify(json)
    fetch(urlOfertantes, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    })
        .then(response => response.json())
        .then( (data) => {
            ofertantes = new OfertantesListado(data.producto,data.nombre,data.precio, data.id)
            listadoDeOfertantes.push(ofertantes)
        })
        .catch(error => console.log(error))
}
function borrarTodaSubasta() {
    listadoDeProduct.forEach((item)=>{
        let idItem = item.id

        fetch(`${urlSubastador}${idItem}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response)
            .catch(error => error)
    })

    listadoDeOfertantes.forEach((item)=>{
        let idItem = item.id

        fetch(`${urlOfertantes}${idItem}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response)
            .catch(error => error)
    })
    listadoDeProduct.splice(0)
    listadoDeOfertantes.splice(0)

}
showOptions()
function showProductContainerInputs() {
    containerAddProduct.style.display = 'block'
    btnStartSubasta.style.display = 'none'
}
function clearFilters() {
    document.getElementById('container-lista').innerHTML = ''
    conainterSearchResult.innerHTML = ''
    inputBuscarNombre.value = ''
    btnSortPrice19.style.display = "none"
    btnSortPrice19.disabled = true
    btnSortPrice91.style.display = "flex"
    btnSortPrice91.disabled = false
    btnSortNameAZ.style.display = "flex"
    btnSortNameAZ.disabled = false
    btnSortNameZA.style.display = "none"
    btnSortNameZA.disabled = true
    if(document.querySelector('#errors #error-find-name')) {
        document.getElementById('error-find-name').remove()
    }
    inputBuscarNombre.className = 'input'
    for (const [item] of Object.entries(listadoDeOfertantes)) {
        let div = document.createElement('div');
        div.setAttribute('class','item-venta');
        div.innerHTML = printListaOferta(listadoDeOfertantes[item].nombre_Producto, listadoDeOfertantes[item].nombre_Ofertante, listadoDeOfertantes[item].precio_Oferta);
        document.getElementById('container-lista').appendChild(div);
    }
}
function deleteProduct() {
    Swal.fire({
        title: "Seguro deseas eliminar la Subasta?",
        text: "Se eliminará la lista de ofertas tambien!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, Eliminar!",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById('productoen-venta').style.display = 'none'
            document.getElementById('lista-ofertantes').style.display = 'none';
            document.getElementById('form-ofertantes').style.display = 'none'
            document.getElementById('info-prod-venta').innerHTML = ''
            document.getElementById('container-lista').innerHTML = ''
            document.getElementById('nombre-ofertante').value = ''
            document.getElementById('precio-producto-oferta').value = ''
            errorsContainer.innerHTML = ''
            nombreSubastador = ''
            productoSubasta = ''
            precioProductoSubasta = ''
            btnStartSubasta.style.display = 'inline-block'
            btnAddOffer.disabled = true
            btnAddOffer.style.display = "none"
            Swal.fire({
                title: "La Subasta fue eliminada satisfactoriamente!",
                text: "Agregue otro producto para subastar.",
                icon: "success"
            });
            borrarTodaSubasta()
        }
    });


}
function printProductoVenta(nombreProducto, nombreVendedor, precioProducto,id){
    let nombreProductoVenta = nombreProducto
    let nombreVendedorProd = nombreVendedor
    let precioProductoVenta = precioProducto
    let idVendedor = id

    return `<div class="item">
            <div class="subtitles">
                <div class="name">Nombre del Producto:</div>
                <div class="name">Precio:</div>
                <div class="name">Nombre del Subastador:</div>
            </div>
            <div class="info">
                <div class="infoprod">${nombreProductoVenta.toUpperCase()}</div>
                <div class="infoprod price">${formatoMiles(precioProductoVenta)}</div>
                <div class="infoprod">${nombreVendedorProd.toUpperCase()}</div>
            </div>
        </div>`
}
function printListaOferta(nombreProducto, nombreVendedor, precioProducto, id){
    let nombreProductoVenta = nombreProducto
    let nombreVendedorProd = nombreVendedor
    let precioProductoVenta = precioProducto
    let idOfertante = id

    return `<div class="item">
            <div class="info">
                <div class="infoprod">${nombreProductoVenta.toUpperCase()}</div>
                <div class="infoprod price">${formatoMiles(precioProductoVenta)}</div>
                <div class="infoprod">${nombreVendedorProd.toUpperCase()}</div>
            </div>
        </div>`
}
function addProductSubasta(e) {
    if(listadoDeProduct.length == 0) {
        e.preventDefault()
        let inputNameSubastador = document.getElementById('nombre-vendedor') || []
        let inputProductSubasta = document.getElementById('nombre-producto-subasta') || []
        let inputPriceSubasta = document.getElementById('precio-producto-subasta') || []
        let priceSubastaNumber = parseFloat(inputPriceSubasta.value)
        let idSubastador = inputIdSubastador.value
        if(inputNameSubastador.value.replace(/^\s+/, '').replace(/\s+$/, '') == ''){
            inputNameSubastador.className = 'input error'
            nombreSubastador = ''
            if(!document.querySelector('#errors #error-subastador-name')){
                let div = document.createElement('div')
                div.setAttribute('class','error-msg')
                div.setAttribute('id','error-subastador-name')
                div.innerHTML = `<i class="fa-solid fa-xmark"></i> Debes ingresar el Nombre del Vendedor`
                errorsContainer.appendChild(div)
            }
        } else {
            if(document.querySelector('#errors #error-subastador-name')) {
                document.getElementById('error-subastador-name').remove()
            }
            inputNameSubastador.className = 'input'
            nombreSubastador = inputNameSubastador.value.replace(/^\s+/, '').replace(/\s+$/, '')
        }
        if(inputProductSubasta.value.replace(/^\s+/, '').replace(/\s+$/, '') == ''){
            inputProductSubasta.className = 'input error'
            productoSubasta = ''
            if(!document.querySelector('#errors #error-subasta-product-name')) {
                let div = document.createElement('div')
                div.setAttribute('class', 'error-msg')
                div.setAttribute('id', 'error-subasta-product-name')
                div.innerHTML = `<i class="fa-solid fa-xmark"></i> Debes ingresar el Nombre del Producto a Subastar`
                errorsContainer.appendChild(div)
            }
        } else {
            inputProductSubasta.className = 'input'
            if(document.querySelector('#errors #error-subasta-product-name')) {
                document.getElementById('error-subasta-product-name').remove()
            }
            productoSubasta = inputProductSubasta.value.replace(/^\s+/, '').replace(/\s+$/, '')
        }
        if(isNaN(priceSubastaNumber) || priceSubastaNumber <= 0){
            inputPriceSubasta.className = 'input error'
            precioProductoSubasta = NaN
            if(isNaN(priceSubastaNumber)){
                if(document.querySelector('#errors #error-subasta-product-price')) {
                    document.getElementById('error-subasta-product-price').remove()
                }
                if(!document.querySelector('#errors #error-subasta-product-price')) {
                    let div = document.createElement('div')
                    div.setAttribute('class', 'error-msg')
                    div.setAttribute('id', 'error-subasta-product-price')
                    div.innerHTML = `<i class="fa-solid fa-xmark"></i> Debes ingresar un Precio para el Producto`
                    errorsContainer.appendChild(div)
                }
            }
            if(priceSubastaNumber <= 0){
                if(document.querySelector('#errors #error-subasta-product-price')) {
                    document.getElementById('error-subasta-product-price').remove()
                }
                if(!document.querySelector('#errors #error-subasta-product-price')) {
                    let div = document.createElement('div')
                    div.setAttribute('class', 'error-msg')
                    div.setAttribute('id', 'error-subasta-product-price')
                    div.innerHTML = `<i class="fa-solid fa-xmark"></i> Debes ingresar un Precio Mayor a 0 para el Producto`
                    errorsContainer.appendChild(div)
                }
            }
        } else {
            inputPriceSubasta.className = 'input'
            if(document.querySelector('#errors #error-subasta-product-price')) {
                document.getElementById('error-subasta-product-price').remove()
            }
            precioProductoSubasta = priceSubastaNumber
        }

        if(nombreSubastador != '' && productoSubasta != '' && !isNaN(precioProductoSubasta)) {
            containerAddProduct.style.display = 'none'
            let div = document.createElement('div');
            div.setAttribute('class','item-venta');
            div.innerHTML = printProductoVenta(productoSubasta, nombreSubastador, precioProductoSubasta);
            document.getElementById('info-prod-venta').appendChild(div)
            document.getElementById('productoen-venta').style.display = 'block'
            btnAddOffer.disabled = false
            btnAddOffer.style.display = "block"
            inputNameSubastador.value = ''
            inputProductSubasta.value = ''
            inputPriceSubasta.value = ''
            Toastify({
                className: "alertOK",
                gravity: 'bottom',
                text: "Se ha agregado el producto correctamente",
                close: true,
                duration: 2000
            }).showToast();
            sendProductToJson(nombreSubastador,productoSubasta,precioProductoSubasta,idSubastador)

        }
    }
}
function addNewOffer(e) {
    let lastOffer = listadoDeOfertantes.length - 1
    if(listadoDeOfertantes.length === 0){
        precioProductoSubasta = listadoDeProduct[0].precio_Producto
    } else {
        precioProductoSubasta = listadoDeOfertantes[lastOffer].precio_Oferta
    }
    e.preventDefault()
    let productoSubasta = listadoDeProduct[0].nombre_Producto
    let inputNameOffer = document.getElementById('nombre-ofertante') || []
    let inputPriceOffer = document.getElementById('precio-producto-oferta') || []
    let priceOfferNumber = parseFloat(inputPriceOffer.value)
    let inputNameOfferWithoutSpace = inputNameOffer.value.replace(/^\s+/, '').replace(/\s+$/, '')

    let idNewOfferNumber = parseInt(inputIdOfertante.value)
    let idFinal

    if(listadoDeOfertantes.length < 1){
        idFinal = idNewOfferNumber
    } else {
        listadoDeOfertantes.forEach( usr => {
            let userId = parseInt(usr.id)
            if(userId === idNewOfferNumber) {
                idNewOfferNumber++
                idFinal = idNewOfferNumber
            } else {
                idFinal = idNewOfferNumber
            }
        })
    }
    let idString = idFinal.toString()


    if(inputNameOfferWithoutSpace == ''){
        inputNameOffer.className = 'input error'
        nombreOfertante = ''
        window.scrollTo(0, 0);
        if(!document.querySelector('#errors #error-ofertante-name')){
            let div = document.createElement('div')
            div.setAttribute('class','error-msg')
            div.setAttribute('id','error-ofertante-name')
            div.innerHTML = `<i class="fa-solid fa-xmark"></i> Debes ingresar el Nombre del Ofertante`
            errorsContainer.appendChild(div)
        }
    } else {
        if(document.querySelector('#errors #error-ofertante-name')) {
            document.getElementById('error-ofertante-name').remove()
        }
        inputNameOffer.className = 'input'
        nombreOfertante = inputNameOfferWithoutSpace
    }
    if(isNaN(priceOfferNumber) || priceOfferNumber <= precioProductoSubasta){
        inputPriceOffer.className = 'input error'
        precioOferta = NaN
        window.scrollTo(0, 0);
        if(isNaN(priceOfferNumber)){
            if(document.querySelector('#errors #error-oferta-product-price')) {
                document.getElementById('error-oferta-product-price').remove()
            }
            if(!document.querySelector('#errors #error-oferta-product-price')) {
                let div = document.createElement('div')
                div.setAttribute('class', 'error-msg')
                div.setAttribute('id', 'error-oferta-product-price')
                div.innerHTML = `<i class="fa-solid fa-xmark"></i> Debes ingresar un Precio para la Oferta`
                errorsContainer.appendChild(div)
            }
        }
        if(priceOfferNumber <= precioProductoSubasta){
            if(document.querySelector('#errors #error-oferta-product-price')) {
                document.getElementById('error-oferta-product-price').remove()
            }
            if(!document.querySelector('#errors #error-oferta-product-price')) {
                let div = document.createElement('div')
                div.setAttribute('class', 'error-msg')
                div.setAttribute('id', 'error-oferta-product-price')
                div.innerHTML = `<i class="fa-solid fa-xmark"></i> El Precio Oferta debe ser mayor a <strong> $ ${formatoMiles(precioProductoSubasta)}</strong>`
                errorsContainer.appendChild(div)
            }
        }
    } else {
        if(document.querySelector('#errors #error-oferta-product-price')) {
            document.getElementById('error-oferta-product-price').remove()
        }
        inputPriceOffer.className = 'input'
        precioOferta = priceOfferNumber
    }
    if(nombreOfertante != ''  && !isNaN(precioOferta) && priceOfferNumber > precioProductoSubasta) {
        containerAddProduct.style.display = 'none'
        let div = document.createElement('div');
        div.setAttribute('class','item-venta');
        div.innerHTML = printListaOferta(productoSubasta, nombreOfertante, precioOferta);
        document.getElementById('container-lista').appendChild(div);
        document.getElementById('lista-ofertantes').style.display = 'block';
        document.getElementById('form-ofertantes').style.display = 'none'
        Toastify({
            className: "alertOK",
            gravity: 'bottom',
            text: "Se ha agregado el producto correctamente",
            close: true,
            duration: 2000
        }).showToast();

        sendOfertanteToJson(nombreOfertante,productoSubasta, precioOferta,idString)
        inputNameOffer.value = ''
        inputPriceOffer.value = ''
        showOptions()
    }
}
function showOptions(){
    if(listadoDeOfertantes.length >= 3) {
        conainterSearchBar.style.display = 'flex'
        conainterFiltersBar.style.display = 'flex'
    } else {
        conainterSearchBar.style.display = 'none'
        conainterFiltersBar.style.display = 'none'
    }
}
function sortByNameAZ(){
    conainterSearchResult.innerHTML = ''
    inputBuscarNombre.value = ''
    sortOffersList = [...listadoDeOfertantes]
    sortOffersList.sort((a, b) => {
        const nameA = a.nombre_Ofertante.toUpperCase()
        const nameB = b.nombre_Ofertante.toUpperCase()
        if (nameA < nameB) {
            return -1
        }
        if (nameA > nameB) {
            return 1
        }
        return 0
    })
    btnSortNameAZ.style.display = "none"
    btnSortNameAZ.disabled = true
    btnSortNameZA.style.display = "flex"
    btnSortNameZA.disabled = false

    document.getElementById('container-lista').innerHTML = ''

    for (const [item] of Object.entries(sortOffersList)) {
        let div = document.createElement('div');
        div.setAttribute('class','item-venta');
        div.innerHTML = printListaOferta(sortOffersList[item].nombre_Producto, sortOffersList[item].nombre_Ofertante, sortOffersList[item].precio_Oferta);
        document.getElementById('container-lista').appendChild(div);
    }

}
function sortByNameZA(){
    conainterSearchResult.innerHTML = ''
    inputBuscarNombre.value = ''
    sortOffersList.reverse()
    btnSortNameAZ.style.display = "flex"
    btnSortNameAZ.disabled = false
    btnSortNameZA.style.display = "none"
    btnSortNameZA.disabled = true

    document.getElementById('container-lista').innerHTML = ''

    for (const [item] of Object.entries(sortOffersList)) {
        let div = document.createElement('div');
        div.setAttribute('class','item-venta');
        div.innerHTML = printListaOferta(sortOffersList[item].nombre_Producto, sortOffersList[item].nombre_Ofertante, sortOffersList[item].precio_Oferta);
        document.getElementById('container-lista').appendChild(div);
    }

}
function sortByPriceMoreLess(){
    conainterSearchResult.innerHTML = ''
    inputBuscarNombre.value = ''
    sortOffersList = [...listadoDeOfertantes]
    sortOffersList.sort(function (a,b) {
        const nameA = a.precio_Oferta
        const nameB = b.precio_Oferta
        return nameB-nameA
    })
    btnSortPrice19.style.display = "flex"
    btnSortPrice19.disabled = false
    btnSortPrice91.style.display = "none"
    btnSortPrice91.disabled = true
    btnSortNameAZ.style.display = "flex"
    btnSortNameAZ.disabled = false
    btnSortNameZA.style.display = "none"
    btnSortNameZA.disabled = true

    document.getElementById('container-lista').innerHTML = ''

    for (const [item] of Object.entries(sortOffersList)) {
        let div = document.createElement('div');
        div.setAttribute('class','item-venta');
        div.innerHTML = printListaOferta(sortOffersList[item].nombre_Producto, sortOffersList[item].nombre_Ofertante, sortOffersList[item].precio_Oferta);
        document.getElementById('container-lista').appendChild(div);
    }
}
function sortByPriceLessMore(){
    conainterSearchResult.innerHTML = ''
    inputBuscarNombre.value = ''
    sortOffersList.reverse()
    btnSortPrice19.style.display = "none"
    btnSortPrice19.disabled = true
    btnSortPrice91.style.display = "flex"
    btnSortPrice91.disabled = false
    btnSortNameAZ.style.display = "flex"
    btnSortNameAZ.disabled = false
    btnSortNameZA.style.display = "none"
    btnSortNameZA.disabled = true

    document.getElementById('container-lista').innerHTML = ''

    for (const [item] of Object.entries(sortOffersList)) {
        let div = document.createElement('div');
        div.setAttribute('class','item-venta');
        div.innerHTML = printListaOferta(sortOffersList[item].nombre_Producto, sortOffersList[item].nombre_Ofertante, sortOffersList[item].precio_Oferta);
        document.getElementById('container-lista').appendChild(div);
    }
}
function filterName(e){
    e.preventDefault()
    let resultadoLista
    let buscarNombre = inputBuscarNombre.value
    let resultado
    let nombre = buscarNombre.trim().toUpperCase()
    if(nombre == ''){
        inputBuscarNombre.className = 'input error'
        conainterSearchResult.innerHTML = ''
        window.scrollTo(0, 0);
        if(!document.querySelector('#errors #error-find-name')){
            let div = document.createElement('div')
            div.setAttribute('class','error-msg')
            div.setAttribute('id','error-find-name')
            div.innerHTML = `<i class="fa-solid fa-xmark"></i> Debes ingresar un nombre para la busqueda`
            errorsContainer.appendChild(div)
        }
    }else {
        if(document.querySelector('#errors #error-find-name')) {
            document.getElementById('error-find-name').remove()
        }
        inputBuscarNombre.className = 'input'
        resultado = listadoDeOfertantes.filter((producto)=> producto.nombre_Ofertante.toUpperCase().includes(nombre))
        if (resultado.length > 0){
            if(!document.querySelector('#search-result .search-result')) {
                let div = document.createElement('div');
                div.setAttribute('class', 'search-result');
                div.innerHTML = `<i class="fa-solid fa-check"></i> Resultado para la busqueda de '<strong>${nombre}</strong>':`;
                conainterSearchResult.appendChild(div);
            } else {
                document.querySelector('#search-result .search-result').remove()
                let div = document.createElement('div');
                div.setAttribute('class', 'search-result');
                div.innerHTML = `<i class="fa-solid fa-check"></i> Resultado para la busqueda de '<strong>${nombre}</strong>':`;
                conainterSearchResult.appendChild(div);
            }

            document.getElementById('container-lista').innerHTML = ''
            resultadoLista = resultado
            for (const [item] of Object.entries(resultadoLista)) {
                let div = document.createElement('div');
                div.setAttribute('class','item-venta');
                div.innerHTML = printListaOferta(resultadoLista[item].nombre_Producto, resultadoLista[item].nombre_Ofertante, resultadoLista[item].precio_Oferta);
                document.getElementById('container-lista').appendChild(div);
            }
        }else{
            if(!document.querySelector('#search-result .search-result')) {
                let div = document.createElement('div');
                div.setAttribute('class', 'search-result error');
                div.innerHTML = `<i class="fa-solid fa-xmark"></i> No se encontró ningún resultado para la busqueda de '<strong>${nombre}</strong>'`;
                conainterSearchResult.appendChild(div);
            } else {
                document.querySelector('#search-result .search-result').remove()
                let div = document.createElement('div');
                div.setAttribute('class', 'search-result error');
                div.innerHTML = `<i class="fa-solid fa-xmark"></i> No se encontró ningún resultado para la busqueda de '<strong>${nombre}</strong>'`;
                conainterSearchResult.appendChild(div);
            }

            document.getElementById('container-lista').innerHTML = ''

            for (const [item] of Object.entries(listadoDeOfertantes)) {
                let div = document.createElement('div');
                div.setAttribute('class','item-venta');
                div.innerHTML = printListaOferta(listadoDeOfertantes[item].nombre_Producto, listadoDeOfertantes[item].nombre_Ofertante, listadoDeOfertantes[item].precio_Oferta);
                document.getElementById('container-lista').appendChild(div);
            }
        }
    }
}
function showFormOfertante() {
    clearFilters()
    let containerFormOffer = document.getElementById('form-ofertantes')
    containerFormOffer.style.display = 'block'
}
