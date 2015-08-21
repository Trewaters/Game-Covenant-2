**Dev Journal**

7/14/2015
- writing two types of 'ChirpApp.js' files.
	-[DONE] one using factory $http
	-[IN PROGRESS] the other using $resource/ng-resource
- User submit game to a specific convention
	1)[DONE] user registers for a convention
		a) [TO DO - DEBUG] unexpected behavior. Convention list won't auto update any longer.
	2) [DONE] select their convention from a drop down list of conventions that they are already registered to. coded to "main.html"
		a) [TO DO - DEBUG] save "conName" to Post collection
			list won't save the selected convention to the user's 
			event post which is what will register their event to 
			the convention. A field on the main.html pulls a list 
			of conventions that the "logged" in player is already registered in.
8/9/2015
- rewrote the entire app using $ngresource [DONE]
