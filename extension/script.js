function run() {
	var nodes = document.querySelectorAll('.rprt');

	for (var i = 0; i < nodes.length; i++) {
		var node = nodes[i];

		var journalNode = node.querySelector('.details .jrnl');

		if (!journalNode) {
			continue;
		}

		journalNode.style.display = 'none';
		journalNode.nextSibling.textContent = journalNode.nextSibling.textContent.replace(/^\s*\.\s*/, '');

		var matches = node.textContent.match(/PMID:\s*(\d+)/);

		if (!matches.length) {
			continue;
		}

		lookup(matches[1], journalNode);
	}
}

function lookup(pmid, journalNode) {
	var url = 'https://api.altmetric.com/v1/pmid/' + pmid;

	var request = new Request(url, {
		referrer: 'http://www.ncbi.nlm.nih.gov/pubmed/'
	});

	fetch(request).then(function(response) {
		if (response.ok) {
			response.json().then(function(data) {
				var url = 'https://d1uo4w7k31k5mn.cloudfront.net/v2/' + Math.round(data.score) + '.png';

				var a = document.createElement('a');
				a.setAttribute('href', data.details_url);
				a.setAttribute('target', '_blank');
				a.style.display = 'block';

				var image = document.createElement('img');
				image.setAttribute('src', url);
				a.appendChild(image);

				journalNode.parentNode.replaceChild(a, journalNode);
			});
		}
	});
}

run();
