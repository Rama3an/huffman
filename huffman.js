let fs = require('fs');
let arg = process.argv;

fs.readFile(arg[2], (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    function Node(letter, freq, used, father, code, lChild, rChild, index) {
        this.letter = letter;
        this.freq = freq;
        this.father = father;
        this.code = code;
        this.used = used;
        this.rChild = rChild;
        this.lChild = lChild;
        this.index = index;
    }

    let text = data.toString();
    let alph = new Array();
    let tree = new Array();

    for (let i = 0; i < text.length; i++)
        alph[text.charAt(i)] = 0;

    for (let i = 0; i < text.length; i++)
        alph[text.charAt(i)]++;


    let powAlph = 0;
    for (let i in alph)
        powAlph++;

    let index = 0;
    for (let i in alph) {
        let n = new Node(i, alph[i], false, null, '', null, null, index);
        tree.push(n);
        index++;
    }

    for (let i = 0; i < index - 1; ++i) {
        let mn1 = Number.POSITIVE_INFINITY;
        let index1 = 0;
        let index2 = 0;
        for (let j = 0; j < tree.length; ++j) {
            if (mn1 > tree[j].freq && !tree[j].used) {
                index1 = j;
                mn1 = tree[j].freq;
            }
        }
        tree[index1].used = true;
        tree[index1].father = tree.length;
        tree[index1].code = '0';

        let mn2 = Number.POSITIVE_INFINITY;
        for (let j = 0; j < tree.length; ++j) {
            if (mn2 > tree[j].freq && !tree[j].used) {
                index2 = j;
                mn2 = tree[j].freq;
            }
        }
        tree[index2].used = true;
        tree[index2].father = tree.length;
        tree[index2].code = '1';

        let n = new Node(tree[index1].letter + tree[index2].letter, tree[index1].freq + tree[index2].freq, false, null, '', index1, index2, tree.length);
        tree.push(n);
    }


    let bincodes = [];
    for (let i = 0; i < index; ++i) {
        let num = i;
        bincodes[tree[i].letter] = '';
        while (tree[num].father != null) {
            bincodes[tree[i].letter] = tree[num].code + bincodes[tree[i].letter];
            num = tree[num].father;
        }
    }

    let codetext = '';
    let decodetext = '';

    if (powAlph == 1)
        bincodes[text[0]] = '0';


    for (let i = 0; i < text.length; ++i)
        codetext += bincodes[text[i]];


    if (powAlph != 1) {
        let root = tree[tree.length - 1];
        for (let i = 0; i < codetext.length; ++i) {
            if (codetext[i] === '0')
                root = tree[root.lChild];
            else
                root = tree[root.rChild];
            if (root.lChild === null && root.rChild === null) {
                decodetext += root.letter;
                root = tree[tree.length - 1];
            }
        }
    }
    else {
        for (let i in bincodes)
            decodetext += i.repeat(text.length);
    }

    let treecodes = '';

    for (let i in bincodes)
        treecodes += `${i}: '${bincodes[i]}' \n`;

    let finishtext = '';
    finishtext = treecodes + '\n' + codetext + '\n\n' + decodetext;


    fs.writeFile('txtforhuffman.txt', finishtext, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
});
