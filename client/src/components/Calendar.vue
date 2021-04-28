<template>
	<div id="calendar"></div>
</template>
<script>
export default {
  name: 'Graph',
  components: {
  },
  methods: {
	daysOfMonth: function () {
		let _table = "<p>jol</p>";
		const rows = 5;
		const cols = 6;
		let c = 1;
		const daysMonth = 31;
		for ( let r = 0 ; r < rows ; r++ ) {
			_table += "<tr>";
			for ( let i = 0 ; i <= cols ; i++ ) {
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
		document.getElementById("calendar").innerHTML = "<table>hola" + _table + "</table>";
	},
  },
  mounted () {
	this.daysOfMonth();
  }
}
</script>
<style type="text/css">
	table > td, td {
	    border: 1px solid black;
    	padding: 11px;
    	text-align: right;
	}
</style>