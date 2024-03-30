function addRow() {
  var ultimoCodigo = document.querySelector("table tbody tr:last-child td:first-child");
  if (ultimoCodigo) {
    codigo = parseInt(ultimoCodigo.textContent) + 1;
  } else {
    codigo = 1;
  }

  codigo = codigo.toString().padStart(3, '0');
  var fechaReporte = prompt("Ingrese la fecha del reporte (AAAA-MM-DD):");
  var fechaEvento = prompt("Ingrese la fecha del evento (AAAA-MM-DD):");
  var lugarEvento = prompt("Ingrese el lugar del evento:");
  var fechaEntrega = prompt("Ingrese la fecha de entrega de trabajo (AAAA-MM-DD):");
  var domicilioCliente = prompt("Ingrese el domicilio del cliente:");
  var paqueteSeleccionado = prompt("Ingrese el paquete seleccionado:");
  var cantidadVendida = prompt("Ingrese la cantidad vendida:");
  var precioUnitario = prompt("Ingrese el precio unitario:");
  var totalVentas = cantidadVendida * precioUnitario;

  var table = document.querySelector("table");
  var tfoot = table.querySelector("tfoot");
  if (!tfoot) {
    tfoot = table.createTFoot(); // Agrega un tfoot vacío si no existe
  }
  var newRow = table.insertRow(tfoot.previousElementSibling.rowIndex);
  
  newRow.innerHTML = `
    <td>${codigo}</td>
    <td>${fechaReporte}</td>
    <td>${fechaEvento}</td>
    <td>${lugarEvento}</td>
    <td>${fechaEntrega}</td>
    <td>${domicilioCliente}</td>
    <td>${paqueteSeleccionado}</td>
    <td>${cantidadVendida}</td>
    <td>$${precioUnitario}.00</td>
    <td>$${totalVentas}.00</td>
  `;
}