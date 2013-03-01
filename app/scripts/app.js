/*global define */
define(['jquery'], function () {
    'use strict';

	var components = [];
	var repoCountdown;

	//https://github.com/login/oauth/access_token?client_id=58880c9dbba75e9113df&code=13fea4ac626ba6027b98;

	var clientId = 58880c9dbba75e9113df;

	var code = 13fea4ac626ba6027b98;

	var fetchRepos = function() {
		$.ajax({
			dataType: "jsonp",
			url: "https://api.github.com/legacy/repos/search/lithiumrepo",
			success: function(response) {
				console.log(response)
				repoCountdown = response.data.repositories.length;
				$.each(response.data.repositories, function() {					
					$.ajax({
						dataType: "jsonp",
						//https://api.github.com/repos/adamayres/lithium/contents/package.json?callback=test
						url: "https://api.github.com/repos/" + this.owner + "/" + this.name + "/contents/package.json",
						success: function(response) {
							var descriptor = $.parseJSON(Base64.decode(response.data.content));
							repoCountdown--;
							$.each(descriptor.components, function(i, component) {
								components.push(component);
							});
						}
					});
				});
			}
		});
	}

	fetchRepos();

	return function(element) {
		var interval = setInterval(function() {
			console.log(repoCountdown)
			if (repoCountdown === 0) {
				clearInterval(interval);
				var componentSource, componentTemplate, componentList;

				componentSource = $("#component-template").html();
				componentTemplate = Handlebars.compile(componentSource);

				componentList = $("<ul/>");

				$.each(components, function(i, component) {
					var renderedComponent = componentTemplate(component);
					componentList.append(renderedComponent);
				});
				element.append(componentList);	
				console.log(components);
			}
			
		}, 300);
	};
});