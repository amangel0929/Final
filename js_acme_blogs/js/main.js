function createElemWithText(HTMLElemStrngToCrt = "p", txtContntOfElToCrt = "", classNameifOneNeeded) {
    let requestedElementCreated = document.createElement(HTMLElemStrngToCrt);    //create the requested HTML element
    requestedElementCreated.textContent = txtContntOfElToCrt;
    if (classNameifOneNeeded) {
      requestedElementCreated.className = classNameifOneNeeded; // set the class of created element
    }
    return requestedElementCreated;
  }
  
  function createSelectOptions(users){
      if(users === undefined || users  === null){  //if no data parameter is given, returns undefined.
          return undefined;
      }
      let optionArray = [];
      for(let user of users){
          var opt = document.createElement('option');
          opt.value = user.id;
          opt.innerHTML = user.name;
          optionArray.push(opt);  // adding the option to the array
      }
      return optionArray;
  }
  
  
  function toggleCommentSection(postID) {
    if (!postID) {
      return;
    }
    const commentSections = document.querySelector(`section[data-post-id='${postID}']`);
    if (commentSections)
      commentSections.classList.toggle('hide');
    return commentSections;
  }   
  
  function toggleCommentButton(postID) {
      if (!postID) {
          return;
      }  
      const selectedButton = document.querySelector(`button[data-post-id='${postID}']`);
      if (selectedButton != null) {
          selectedButton.textContent === 'Show Comments' ? selectedButton.textContent = 'Hide Comments' : selectedButton.textContent = 'Show Comments';   //toggle to which it shows
      }
      return selectedButton;
  }
  
  
  function deleteChildElements(parentElement) {
     if (!parentElement || !parentElement.nodeType) {   //undefined if not HTML element
          return undefined;
      }
    let child = parentElement.lastElementChild;
    while (child) {
      parentElement.removeChild(child);
      child = parentElement.lastElementChild;
    }
    return parentElement;
  }
  
  
  const addButtonListeners = () => {
      let myMainElem = document.querySelector('main');
      let buttonsList = myMainElem.querySelectorAll('button');
      if(buttonsList){
          for(let i = 0; i < buttonsList.length; i++){
              let myButton = buttonsList[i];
              let postId = myButton.dataset.postId;
              myButton.addEventListener('click', function(event){   //adding button event
                  toggleComments(event, postId), false;
              })
          }
          return buttonsList;
      }
  }
  
  const removeButtonListeners = () => {
      let myMainElem = document.querySelector('main');
      let buttonsList = myMainElem.querySelectorAll('button');
      if(buttonsList){
          for(let i = 0; i < buttonsList.length; i++){
              let myButton = buttonsList[i];
              let postId = myButton.dataset.postId;
              myButton.removeEventListener('click', function(event){   //removing button event
              toggleComments(event, postId), false;
          })
          }
          return buttonsList;
      }
  }
  
  
  function createComments(comments) {
        if (!comments) {
          return undefined;
        }
        let frag = document.createDocumentFragment();
        for (let i = 0; i < comments.length; i++) {   //loop through all comments
          const element = comments[i];
          let article = document.createElement("article");   //creating article
  
          let h3 = createElemWithText("h3", element.name);  
          let p1 = createElemWithText("p", element.body);
          let p2 = createElemWithText("p", `From: ${element.email}`);
          
          article.appendChild(h3);   //appending elements
          article.appendChild(p1);
          article.appendChild(p2);
  
          frag.appendChild(article);  //append to fragment
        }
        return frag;
      }
  
  
  
  function populateSelectMenu(users) {
      if (!users) {
        return undefined;
      }
      let menu = document.querySelector("#selectMenu");
      let options = createSelectOptions(users);   // passes the data to createSelectOptions
      for (let i = 0; i < options.length; i++) {   //loop and append each option
          let option = options[i];
          menu.append(option);
      }
      return menu;
  }
  
  
  
  let getUsers = async() => {
          let retrieve;
          try {   //fetch users
              retrieve = await fetch("https://jsonplaceholder.typicode.com/users");
          }
          catch (error) {
              console.log(error);
          }
          return await retrieve.json();
      }
  
  
  let getUserPosts = async(userId) => {
          if (!userId) {
            return undefined;
          }
          let retrieve;
          try { 
              retrieve = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
          }
          catch (error) {
              console.log(error);
          }
          return retrieve.json();
      }
  
  
  let getUser = async(userId) => {
          if (!userId) {
            return undefined;
          }
          let retrieve;
          try {  //fetch user id data
              retrieve = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
          }
          catch (error) {
              console.log(error);
          } 
          return retrieve.json();
      }
  
  const getPostComments = async (postId) => {
      if(!postId) {
        return undefined;
      }
      try {  //fetch post comments
          const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
          const jsonPostComments = await response.json();
          return jsonPostComments;
          } catch(error){
              return error;
      }
  }
  
  
  const displayComments = async (postId) =>{
      if(!postId) {
        return undefined;
      }
    
      let section = document.createElement("section");
      section.dataset.postId = postId;
      section.classList.add("comments", "hide");
      const comments = await getPostComments(postId);
      const fragment = createComments(comments);
      section.append(fragment);
      return section;
  }
  
  
  const createPosts = async (jsonPosts) => {
      if(!jsonPosts) {
        return undefined;
      }
  
      let fragment = document.createDocumentFragment();
      for (let i = 0; i < jsonPosts.length; i++) {
          let post = jsonPosts[i];
  
          let article = document.createElement("article");
          let section = await displayComments(post.id);
          let author = await getUser(post.userId);
  
          let h2 = createElemWithText("h2", post.title);
          let p = createElemWithText("p", post.body);
          let p2 = createElemWithText("p", `Post ID: ${post.id}`);
          let p3 = createElemWithText("p", `Author: ${author.name} with ${author.company.name}`);
          let p4 = createElemWithText("p", `${author.company.catchPhrase}`);
  
          let button = createElemWithText("button", "Show Comments");
          button.dataset.postId = post.id;
  
          article.append(h2, p, p2, p3, p4, button, section); 
          fragment.append(article);
      }
      return fragment;
  }
  
  const displayPosts = async (posts) => {
      let myMain = document.querySelector("main");
      let element = (posts) ? await createPosts(posts) : document.querySelector("main p");
      myMain.append(element);
      return element;
  }
  
  
  function toggleComments(event, postId){
      if (!event || !postId){
          return undefined;
      }
      event.target.listener = true;
      let section  = toggleCommentSection(postId);
      let button = toggleCommentButton(postId);
      return [section, button];
  }
  
  
  const refreshPosts = async (posts) => {
      if (!posts){
          return undefined;
      }
      let buttons = removeButtonListeners();
      let myMain = deleteChildElements(document.querySelector("main"));
      let fragment = await displayPosts(posts);
      let button = addButtonListeners();
      return [buttons, myMain, fragment, button];
  }
  
  
  const selectMenuChangeEventHandler = async (e) => {
     if (!e){
          return undefined;
      }
      let userId = e?.target?.value || 1;
      let posts = await getUserPosts(userId);
      let refreshPostsArray = await refreshPosts(posts);
      return [userId, posts, refreshPostsArray];
  }
  
  const initPage = async() => {
      let users = await getUsers();
      let select = populateSelectMenu(users);
      return [users, select];
  }
  
  
  function initApp(){
      initPage();
      let select = document.getElementById("selectMenu");
      select.addEventListener("change", selectMenuChangeEventHandler, false);
  }
  
  document.addEventListener("DOMContentLoaded", initApp, false);