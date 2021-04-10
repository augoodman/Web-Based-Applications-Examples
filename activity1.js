//1. Output to the console the <ol> element encompassing the results of the search
document.getElementById("b_results")

//2. Output to the console the code for the \"onload\" event on the <body> element
document.getElementsByTagName("body")[0].getAttribute("onload")

//3. Output to the console the 2nd child node underneath the <body> element
document.body.childNodes[1]

//4. Output to the console the number of <h2> tags in the page
document.getElementsByTagName("h2").length

//5. Output to the console the value in the search bar (you must get this from the search bar not anywhere else on the page)
document.getElementsByClassName("b_searchbox")[0].getAttribute("value")

//6. Make the "Add Bing New Tab Extension" text in the upper right corner result go away
document.getElementsById("id_containing_bing_ext")[0].innerHTML = ""
//NOTE: "Add Bing New Tab Extension" does not appear in the HTML. Above is an example of what a solution might look like.