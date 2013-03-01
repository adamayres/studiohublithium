/*global define */
define(['jquery'], function () {
    'use strict';

	var components = [];
	var repoCountdown;

	var fetchRepos = function() {
		$.ajax({
			dataType: "jsonp",
			url: "https://api.github.com/legacy/repos/search/lithiumrepo",
			success: function(response) {
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
	
	return function(element) {
		var componentSource, componentTemplate, componentList, cachedComponents;

		componentList = $("<ul/>");

		cachedComponents = localStorage.getItem("components");
		
		if (cachedComponents) {
			components = JSON.parse(cachedComponents);
			repoCountdown = 0;
		} else {
			fetchRepos();
		}

		var interval = setInterval(function() {
			if (repoCountdown === 0) {
				clearInterval(interval);
				
				componentSource = $("#component-template").html();
				componentTemplate = Handlebars.compile(componentSource);

				$.each(components, function(i, component) {
					var renderedComponent = componentTemplate(component);
					componentList.append(renderedComponent);
				});
				element.append(componentList);
				debugger;
				console.log(JSON.stringify(components));
				localStorage.setItem("components", JSON.stringify(components));	
			}
			
		}, 300);
	};
});