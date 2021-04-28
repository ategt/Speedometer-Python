
<script>
	function daysOfMonth() {
		let _table = "<p>jol</p>";
		const rows = 5;
		const cols = 6;
		let c = 1;
		const daysMonth = 31;
		for ( const r = 0 ; r < rows ; r++ ) {
			_table += "<tr>";
			for ( const i = 0 ; <= cols ; i++ ) {
				if ( c <= daysMonth ) {
					_table += "<td>" + c + "</td>";
				} else {
					break;
				}
				c++;
				// each col should display number at i
			}
			_table += "</tr>";
		}
		document.gtElementById("calendar").innerHTML = "<table>hola" + _table + "</table>";
	}
	daysOfMonth();
</script>