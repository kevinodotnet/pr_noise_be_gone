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

walkNode(document.body);

var observerCallback = function (mutationsList, observer) {
    observer.disconnect();
    walkNode(document.body);
    observer.observe(document.body, {attributes: true, childList: true, subtree: true});
}

var observer = new MutationObserver(observerCallback);
observer.observe(document.body, {attributes: true, childList: true, subtree: true});
