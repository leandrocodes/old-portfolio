var originalText = "original";
var compressedText = "compressed";


function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function (element) {

        this.content.push(element);

        this.bubbleUp(this.content.length - 1);
    },

    pop: function () {

        var result = this.content[0];
        var end = this.content.pop();

        if (this.content.length > 0) {
            this.content[0] = end;
            this.sinkDown(0);
        }
        return result;
    },

    remove: function (node) {
        var length = this.content.length;

        for (var i = 0; i < length; i++) {
            if (this.content[i] != node) continue;

            var end = this.content.pop();

            if (i == length - 1) break;

            this.content[i] = end;
            this.bubbleUp(i);
            this.sinkDown(i);
            break;
        }
    },

    size: function () {
        return this.content.length;
    },

    bubbleUp: function (n) {

        var element = this.content[n],
            score = this.scoreFunction(element);

        while (n > 0) {

            var parentN = Math.floor((n + 1) / 2) - 1,
                parent = this.content[parentN];

            if (score >= this.scoreFunction(parent)) break;

            this.content[parentN] = element;
            this.content[n] = parent;
            n = parentN;
        }
    },

    sinkDown: function (n) {

        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while (true) {

            var child2N = (n + 1) * 2,
                child1N = child2N - 1;

            var swap = null;

            if (child1N < length) {

                var child1 = this.content[child1N],
                    child1Score = this.scoreFunction(child1);

                if (child1Score < elemScore) swap = child1N;
            }

            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap == null ? elemScore : child1Score))
                    swap = child2N;
            }
        

            if (swap == null) break;


            this.content[n] = this.content[swap];
            this.content[swap] = element;
            n = swap;
        }
    }
};


function HuffmanCoding(inputString) {
    this.inputString = inputString;

    var letterCount = {};

    for (var i = 0; i < inputString.length; i++) {
        if (inputString[i] in letterCount) {
            letterCount[inputString[i]]++;
        } else {
            letterCount[inputString[i]] = 1;
        }
    }


    var huffmanHeap = new BinaryHeap(function (x) {
        return x[0];
    });


    for (var letter in letterCount) {
        huffmanHeap.push([letterCount[letter], letter]);
    }

    while (huffmanHeap.size() > 1) {

        var leftNode = huffmanHeap.pop();
        var rightNode = huffmanHeap.pop();


        huffmanHeap.push([leftNode[0] + rightNode[0], [leftNode[1], rightNode[1]]]);
    }

    var huffmanTree = huffmanHeap.pop();
    this.huffmanCodes = {};

    this.encode(huffmanTree[1], "");


    this.huffmanString = "";
    for (var i = 0; i < this.inputString.length; i++) {
        this.huffmanString += this.huffmanCodes[inputString[i]];
    }


    this.sortedCodes = Object.entries(this.huffmanCodes);


    this.sortedCodes.sort(function (a, b) {
        if (a[1].length < b[1].length) {
            return -1;
        }
        if (a[1].length > b[1].length) {
            return 1;
        }
        return 0;
    });
}


HuffmanCoding.prototype.encode = function (subtree, prefix) {
    if (subtree instanceof Array) {

        this.encode(subtree[0], prefix + "0");

        this.encode(subtree[1], prefix + "1");
    } else {
        this.huffmanCodes[subtree] = prefix;
    }
};

function getHuffmanCodes() {
    var huff = new HuffmanCoding(originalText);

    $("#huffman-tbody").empty();

    for (var [key, value] of huff.sortedCodes) {
        $("#huffman-tbody").append(
            "<tr><td>" + key + "</td><td>" + value + "</td></tr>"
        );
    }


    compressedText = huff.huffmanString;
}


function getByteLength(str) {
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xdc00 && code <= 0xdfff) i--;
    }
    return s;
}

function getCompTextColor(compValue) {
    compValue = Number(compValue);

    if (compValue > 70) return "rgb(0,255,0)";
    else if (compValue > 50) return "rgb(40,215,0)";
    else if (compValue > 30) return "rgb(80,175,0)";
    else if (compValue > 10) return "rgb(175,80,0)";
    else if (compValue > -10) return "rgb(215,40,0)";
    else return "rgb(255,0,0)";
}


function calculateCompression() {
    let originalBitCount = getByteLength(originalText) * 8;
    let compressedBitCount = compressedText.length;
    let compressionPercent = (
        (1 - compressedBitCount / originalBitCount) *
        100
    ).toFixed(2);
    $("#ogFileSize").html(originalBitCount);
    $("#comFileSize").html(compressedBitCount);
    $("#compressRatio").html(compressionPercent + "%");
    $("#compressRatio").css("color", getCompTextColor(compressionPercent));
}

function websiteGoClick() {
    originalText = "<plaintext>";

    let websiteUrl = $("#website-url").val();

    $.get(websiteUrl, function (response) {

        let websiteHtml = response.responseText
            .replace(/&#xd;/g, "")
            .replace(/([\n\r][ \t]*){2,}/g, "\n");
        $("#render").html(websiteHtml);
        originalText += websiteHtml;
        originalText += "</plaintext>";
        getHuffmanCodes(originalText);
        calculateCompression();

        $("#results").css("visibility", "visible");
    });

    $(".modal-title").html(websiteUrl);
}


function fileGoClick() {
    originalText = "";

    var file = $("#inputFile")[0].files[0];

    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            originalText = evt.target.result;
            $("#render").html(originalText);
            getHuffmanCodes(originalText);
            calculateCompression();

            $("#results").css("visibility", "visible");
        };
        reader.onerror = function (evt) {
            alert("Error reading file");
        };
    }

    $(".modal-title").html(file["name"]);
    $("#mod-date").html(file["lastModifiedDate"]);
}


function setModalBody(key) {
    if (key === 0) {
        $(".modal-body").html(originalText);
    } else {
        $(".modal-body").html(compressedText);
    }
}

function resetResults() {
    $("#results").css("visibility", "hidden");
}