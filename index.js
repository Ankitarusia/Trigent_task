function renderUser(){
    fetch('./cart.json',{
        method: 'GET',
        headers: {'Content-Type':'application/json'},
        mode: 'cors',
        cache: 'default',
    })
    .then(response=>{
        if(!response.ok){
            throw Error("Error");
        } 
        return response.json();
    })
    .then(data=>{
        let html = '';
        for (let user = 0; user < data.Items.length; user++) {
            let htmlSegment =   `<div class="cart-item d-flex justify-content-between text-capitalize my-3">
                                    <div class="discount"><span>${data.Items[user].discount}% off</span></div>
                                    <div class="img-box"><img src="${data.Items[user].image}" ></div>
                                    <div class="item-text">
                                        <h2>${data.Items[user].name}</h2>
                                        <div class="cart-price">
                                            <p class="wrong-cart"><span>$</span>
                                            <span id="cart-item-price" class="cart-item-price" class="mb-0">${data.Items[user].price.actual}</span></p>
                                            <p><span>$</span>
                                            <span id="cart-item-price" class="cart-item-price" class="mb-0">${data.Items[user].price.display}</span>
                                            </p>
                                            
                                        </div>
                                        <a href="#" data-name="${data.Items[user].name}" data-price="${data.Items[user].price.display}" class="btn add-to-cart">Add to Cart</a>
                                    </div>
                                </div>`;

            html += htmlSegment;
        }
        let cart = document.querySelector('.cart');
        cart.innerHTML = html;
        let addTocart=[];
        function Item(name, price, count) {
            this.name = name;
            this.price = price;
            this.count = count;
        }
        function saveCart() {
        sessionStorage.setItem('data', JSON.stringify(addTocart));
        }
        function loadCart() {
            addTocart = JSON.parse(sessionStorage.getItem('data'));
            }
        if (sessionStorage.getItem("data") != null) {
            loadCart();
        }
        function addItemToCart(name, price, count) {
            for(var item in addTocart) {
                if(addTocart[item].name === name) {
                    addTocart[item].count ++;
                    saveCart();
                    return;
                }
            }
            var item = new Item(name, price, count);
            addTocart.push(item);
            saveCart();
        }
        function removeItemFromCart(name) {
            for(var item in addTocart) {
                if(addTocart[item].name === name) {
                    addTocart[item].count --;
                    if(addTocart[item].count === 0) {
                        addTocart.splice(item, 1);
                    }
                    break;
                }
            }
            saveCart();
        }
        function setCountForItem(name, count) {
            for(var i in addTocart) {
                if (addTocart[i].name === name) {
                    addTocart[i].count = count;
                    break;
                }
            }
        }
        function totalCart() {
            var totalCart = 0;
            for(var item in addTocart) {
            totalCart += addTocart[item].price * addTocart[item].count;
            }
            return Number(totalCart.toFixed(2));
        }
            // List cart
        function listCart() {
            var cartCopy = [];
            for(i in addTocart) {
                item = addTocart[i];
                itemCopy = {};
                for(p in item) {
                    itemCopy[p] = item[p];
                }
                itemCopy.total = Number(item.price * item.count).toFixed(2);
                cartCopy.push(itemCopy)
            }
            return cartCopy;
        }
        $('.add-to-cart').click(function(event) {
            event.preventDefault();
            var name = $(this).data('name');
            var price = Number($(this).data('price'));
            addItemToCart(name,price, 1);
            displayCart();
        });
        function displayCart() {
            var cartArray = listCart();
            var output = "";
            for(var i in cartArray) {
            output += '<li class="cd-cart__product"><div class="cd-cart__details"><h3 class="truncate"><a href="#0">'+ cartArray[i].name +'</a></h3><span class="cd-cart__price">'+ cartArray[i].price + '</span><div class="input-group"><button class="minus-item input-group-addon btn btn-primary" data-name="' + cartArray[i].name + '">-</button><input type=number class="item-count form-control" data-name="' + cartArray[i].name + '" value="' + cartArray[i].count + '"><button class="plus-item btn btn-primary input-group-addon" data-name="'+ cartArray[i].name + '">+</button></div><span class="cd-cart__price">'+ cartArray[i].total +'</span></div></li>';
            }
            $('.show-cart').html(output);
            $('.total-cart').html(totalCart());
        }
        // -1
        $('.show-cart').on("click", ".minus-item", function(event) {
            var name = $(this).data('name');
            removeItemFromCart(name);
            displayCart();
        })
        // +1
        $('.show-cart').on("click", ".plus-item", function(event) {
            var name = $(this).data('name');
            addItemToCart(name);
            displayCart();
        })
        $('.show-cart').on("change", ".item-count", function(event) {
            var name = $(this).data('name');
            var count = Number($(this).val());
            setCountForItem(name, count);
            displayCart();
        });
    })   
}

renderUser();