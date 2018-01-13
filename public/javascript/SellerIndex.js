$('#myTab').on('click', function (e) {
  e.preventDefault();
  $(this).tab('show');
});

function editModal(event) {
  var item = event.getAttribute("data-item");
  item = JSON.parse(item);
  document.getElementById('exampleModalLabel').innerHTML = item.ItemName;
  document.getElementById('itenName').value = item.ItemName;
  document.getElementById('modelName').value = item.ModelName;
  document.getElementById('brandName').value = item.BrandName;
  document.getElementById('amount').value = item.Amount;
  document.getElementById('stock').value = item.Stock;
  document.getElementById('category').value = item.Category;
  document.getElementById('description').value = item.Description;
  document.getElementById('itemIconEdit').src = item.Image;
  document.getElementById('editButton').setAttribute('data-id', item._id);

  function sendData() {
    var XHR = new XMLHttpRequest();
    var FD = new FormData(form);

    XHR.addEventListener("load", function(event) {
      swal("Successfully Updated!", "", "success");
    });
    XHR.addEventListener("error", function(event) {
      swal("Sorry!", "Something went wrong", "error");
    });
    XHR.open("put", "/editProduct/"+item._id);
    XHR.send(FD);
  }

  // Access the form element...
  var form = document.getElementById("editForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    sendData();
  });
}

function deleteModal(event) {
  var item = event.getAttribute("data-item");
  item = JSON.parse(item);

  var XHR = new XMLHttpRequest();

  XHR.addEventListener("load", function(event) {
    swal("Successfully Deleted!", "You clicked the button!", "success");
    window.location.href = "/SellerIndex";
  });
  XHR.addEventListener("error", function(event) {
    swal("Sorry!", "Something went wrong", "error");
  });
  XHR.open("delete", "/deleteProduct/"+item._id);
  XHR.send({id: item._id});
}
