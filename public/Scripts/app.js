// app.js

function isInteger (n) {
    return typeof n === "number" && n % 1 === 0;
};

function isString (s) {
    return typeof s === "string";
};

function valueOrUndefinedOrError (value, check) {
    if (typeof value === "undefined" || check.call(undefined, value)) {
	return value;
    } else {
	throw new Error("Not a valid input value: " + value);
    }
};

function Note (id, subject, content) {
    this.base_url = "/note";
    this.id      = valueOrUndefinedOrError(id, isInteger);
    this.subject = valueOrUndefinedOrError(subject, isString);
    this.content = valueOrUndefinedOrError(content, isString);
};

Note.prototype.url = function() {
    if (isInteger(this.id)) {
	return this.base_url + "/" + this.id;
    } else {
	return this.base_url;
    };
};

Note.prototype.toJSON = function() {
    var this_note = {};
    if (isInteger(this.id)) {
	this_note.id = this.id;
    }
    this_note.subject = this.subject; 
    this_note.content = this.content;
    return JSON.stringify(this_note);
};

Note.prototype.toHTMLTableRow = function() {
    return "<tr><td>" + this.id + "</td><td>" + this.subject + "</td><td>" + this.content + "</td></tr>";
};

Note.prototype.toKeyValStr = function() {
    return "id: " + this.id + ", subject: " + this.subject + ", content: " +this.content;
};

Note.prototype.toValStr = function() {
    return this.id + ", " + this.subject + ", " + this.content;
};

Note.prototype.fetch = function () {
    $.ajax({
	url: this.url(),
	dataType: "json",
	success: function (data) {
	    this.subject = data.subject;
	    this.content = data.content;
	    console.log(this); },
	type: "GET",
	context: this
    });
};

Note.prototype.save = function () {
    var http_method;
    if (isInteger(this.id)) {
	http_method = "POST";
    } else {
	http_method = "PUT";
    };
    $.ajax({
	url: this.url(),
	dataType: "json",
	data: this.toJSON(),
	success: function (data) {
	    console.log(data);
	},
	type: http_method,
	context: this
    });
};

Note.prototype.destroy = function () {
    // TODO
    $.ajax({
	url: this.url(),
	dataType: "json",
	data: this.toJSON(),
	success: function () {},
	type: "DELETE",
	context: this
    });
}; 


// Note object Tests.
// Comment out when not in use

//var my_note = new Note(undefined, undefined, 1);

//my_note.fetch();

//var n = new Note("Marvin", "Depressed Android.", 10);

//n.save();

// var mediator = {};
// mediator.addEventListener('Note: fetched', refresh); // ?

function Notes() {
    this.base_url = "/notes";
//    this.column_names = ["id", "subject", "content"];
    this.data = [];
};

Notes.prototype.fetchall = function() {
    return $.ajax({ 
	url: this.base_url + "/all",
	datatype: "json",
	success: function(data) {
	    this.data = [];
	    _this = this; // for reference in $.each
	    $.each(data, function (index, value) {
		n = new Note(value["id"], value["subject"], value["content"]);
		_this.data.push(n); 
	    });
	},
	type: "GET",
	context: this
    });
};

Notes.prototype.fetchsome = function() {};

Notes.prototype.toHTMLTableHead = function() {
    return "<tr><th>ID</th><th>Subject</th><th>Content</th></tr>";
};

Notes.prototype.toHTMLTable = function() {
    var str = "<table>\n";
    str += this.toHTMLTableHead() + "\n";
    _this = this; // for reference in $.each
    $.each(this.data, function (index, note) {
	str += note.toHTMLTableRow() + "\n";
	});
    str += "</table>\n";
    return str;
};


function Report (id) {
    this.id = id;
};

Report.prototype.reset = function () {
    $(this.id).html("");
};

Report.prototype.write = function (stuff) {
    $(this.id).html(stuff);
};

ns = new Notes();
ns.fetchall().done(function () {
    r = new Report("#notes-table");
    r.write(ns.toHTMLTable());
});

/*
Notes.prototype.updateidselection = function () {
    $.ajax({
	url: this.base_url,
	datatype: "json",
	type: "GET",
	success: function(data) {
	    var n;
	    $("#txt-noteid").html("");
	    $(data).each(function (index) {
		n = new Note(data[index]["id"], data[index]["subject"], data[index]["content"]);
		$("#txt-noteid").append(n.toKeyValStr());
	    });
	}
    });
};
*/


function Input (id) {
    this.id = id;
};

//function refresh() {};

// $("#notes-table").prototype.refresh = function ()
    
// $("#notes-table").addEventListener("Note: fetched", refresh);
