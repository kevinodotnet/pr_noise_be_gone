function initPolicial(trNode) {
    if (trNode.getAttribute('data-policial-be-gone')) {
        return;
    }
    trNode.setAttribute('data-policial-be-gone', 'tophat');

    var warningDiv = document.createElement('div');
    warningDiv.innerHTML = "&nbsp;";
    warningDiv.style.background = '#ff0000';
    warningDiv.style.height = '1px';

    var newTd = document.createElement('td');
    newTd.appendChild(warningDiv);

    var newTr = document.createElement('tr');
    newTr.appendChild(newTd);

    trNode.parentNode.insertBefore(newTr, trNode);
    trNode.style.display = 'none';

    count = parseInt(document.body.getAttribute('data-policial-hidden-count')) + 1;
    document.body.setAttribute('data-policial-hidden-count', count);
}

function walkNode(node) {
    var child = node.firstChild;
    while (child) {
        if (child.tagName == 'DIV' && child.classList.contains('check-annotation-failure')) {
            var tdNode = child.parentNode;
            var trNode = tdNode.parentNode;
            if (trNode.tagName == 'TR') {
                initPolicial(trNode);
            }
        } else {
            walkNode(child);
        }
        child = child.nextSibling;
    }
}

function toggleVisible() {
    var setDisplay;
    if (document.body.getAttribute('data-policial-hidden-count-visible') == '0') {
        document.body.setAttribute('data-policial-hidden-count-visible', '1');
        setDisplay = '';
    } else {
        document.body.setAttribute('data-policial-hidden-count-visible', '0');
        setDisplay = 'none';
    }

    for (let trNode of document.getElementsByTagName('TR')) {
        if (! trNode.getAttribute('data-policial-be-gone')) {
            continue;
        }
        trNode.style.display = setDisplay;
    }
}

function getReviewToolsDiv() {
    return document.body.getElementsByClassName('pr-review-tools')[0];
}

function displayHiddenCount() {
    if (!getReviewToolsDiv()) {
        return;
    }
    var id = 'data-policial-hidden-count';
    var hiddenCountDiv = document.getElementById(id);
    if (!hiddenCountDiv) {
        hiddenCountDiv = document.createElement('button');
        hiddenCountDiv.addEventListener("click", toggleVisible, false);
    }
    hiddenCountDiv.id = id;
    hiddenCountDiv.innerHTML = "noises hidden: ";
    hiddenCountDiv.innerHTML += document.body.getAttribute('data-policial-hidden-count');
    hiddenCountDiv.classList.add('diffbar-item');
    hiddenCountDiv.style.background = '#ff0000';
    hiddenCountDiv.style.color = '#ffffff';
    hiddenCountDiv.style.padding = '5px';
    hiddenCountDiv.style.borderRadius = '10px';

    getReviewToolsDiv().insertBefore(hiddenCountDiv, getReviewToolsDiv().firstChild);
}

document.body.setAttribute('data-policial-hidden-count-visible', '0');
document.body.setAttribute('data-policial-hidden-count', '0');
walkNode(document.body);
displayHiddenCount();

var observerCallback = function (mutationsList, observer) {
    observer.disconnect();
    walkNode(document.body);
    displayHiddenCount();
    observer.observe(document.body, {attributes: true, childList: true, subtree: true});
}

var observer = new MutationObserver(observerCallback);
observer.observe(document.body, {attributes: true, childList: true, subtree: true});
