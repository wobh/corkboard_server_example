// app.js

function isInteger (n) {
    return typeof n === "number" && n % 1 === 0;
};

function Note (subject, content, id) {
    this.base_url = "/note";
    this.subject = subject;
    this.content = content;
    if (typeof id === "undefined") {
	this.id = undefined;
    } else if (isInteger(id)) {
	this.id = id;
    } else {
	throw new Error("Not a valid input value: " + id);
    }
};

Note.prototype.url = function() {
    if (isInteger(this.id)) {
	return this.base_url + "/" + this.id;
    } else {
	return this.base_url;
    };
};

Note.prototype.json = function() {
    var this_note = {"subject": this.subject, "content": this.content};
    if (isInteger(this.id)) {
	this_note.id = this.id;
    }
    return JSON.stringify(this_note);
};

Note.prototype.fetch = function () {
    $.ajax({
	url: this.url(),
	dataType: "json",
	success: function (data) {
	    this.subject = data.subject;
	    this.content = data.content;
	    console.log(this); },
	context: this
    });
};

var my_note = new Note(undefined, undefined, 1);

my_note.fetch();

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
	data: this.json(),
	success: function (data) {
	    console.log(data);
	},
	type: http_method,
	context: this
    });
};

Note.prototype.destroy = function () {
    // TODO
};

var n = new Note("Marvin", "Depressed Android.", 10);

n.save();
