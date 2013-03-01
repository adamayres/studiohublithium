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
					var baseEditUrl = "https://github.com/" + this.owner + "/" + this.name + "/edit/master/";
					var baseConentsUrl = "https://api.github.com/repos/" + this.owner + "/" + this.name + "/contents/";			
					$.ajax({
						dataType: "jsonp",
						//https://api.github.com/repos/adamayres/lithium/contents/package.json?callback=test
						url: baseConentsUrl + "package.json",
						success: function(response) {
							var descriptor = $.parseJSON(Base64.decode(response.data.content));
							repoCountdown--;
							$.each(descriptor.components, function(i, component) {
								component.contentsUrl = baseConentsUrl + component.location;
								component.editUrl = baseEditUrl + component.location;
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

		componentList = $("<ul/>", {
			"class": "components"
		});

		//cachedComponents = [{"name":"Hello World","description":"Test component that outputs Hello World","author":"Adam Ayres","location":"components/helloworld.ftl","image":"https://raw.github.com/adamayres/lithium/master/components/helloworld.jpeg"},{"description":"DBSHJCBDH","location":"components/testmodal.ftl","name":"testing1"},{"description":"give us feedback now!","location":"components/Feedback_Survey.ftl","name":"survey for admin feedback","image":"https://raw.github.com/chhamajain/lithium/master/components/Feedback_Survey.png"},{"description":"sidebar for communities","location":"components/FBSidebar.ftl","name":"Facebook sidebar","image":"https://raw.github.com/chhamajain/lithium/master/components/FBSidebar.png"},{"test":"test"},{"description":"this is a test component","location":"components/newcomponent.ftl","name":"test component"},{"description":"Awesome component","location":"components/test.ftl","name":"This is for Chhama"},{"description":"djhsjlkdjs","location":"components/testmodal.ftl","name":"tsting"},{"description":"rretregfddb","location":"components/testmodal.ftl","name":"testing2"},{"description":"Lithium lithium lithium","location":"components/jacy.ftl","name":"This is a new name for the component"},{"description":"rretregfddb","location":"components/testmodal.ftl","name":"testing2"},{"description":"hdskjacs","location":"components/testmodal.ftl","name":"testing3"},{"description":"fdsfsfs","location":"components/testmodal.ftl","name":"dsfdsfdsf"},{"description":"sfdsfd","location":"components/test.ftl","name":"sfdsf"},{"description":"sdsfv","location":"components/test.ftl","name":"tetreu"},{"description":"let's share it","location":"components/new-component.ftl","name":"this is a new component"},{"description":"dfsdsf","location":"components/test.ftl","name":"df"},{"description":"xzbhckc","location":"components/testmodal.ftl","name":"test678"},{"description":"dsfg","location":"components/test.ftl","name":"dsff"},{"description":"dggfd","location":"components/testmodal.ftl","name":"df"},{"description":"rrrh","location":"components/testmodal.ftl","name":"ret"},{"description":"hhg","location":"components/test.ftl","name":"gtr"},{"description":"sadfasdf asdf","location":"components/studiohub.ftl","name":"aiososdfa;jfdsap;"},{"description":"this is for you","location":"components/feedback.ftl","name":"admin feedback"}];
		cachedComponents = localStorage.getItem("components");
		
		if (cachedComponents) {
			//components = cachedComponents;
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
					component.image = component.image || "http://studiohublithium.com/images/no-image.png";
					componentList.append("<li>" + componentTemplate(component) + "</li>");
				});

				element.append(componentList);
				console.log(JSON.stringify(components));
				localStorage.setItem("components", JSON.stringify(components));	
			}
			
		}, 300);
	};
});