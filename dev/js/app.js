function fetchGitHubData(){$.getJSON("https://api.github.com/repos/HeyPuter/puter",function(data){$(".github-stars").text(((data=data.stargazers_count)<1e3?data:data<1e6?(data/1e3).toFixed(1)+"K":(data/1e6).toFixed(1)+"M")+"")}).fail(function(jqxhr,textStatus,error){console.error("Request Failed: "+(textStatus+", "+error)),$(".github-stars").text("Heyputer/Puter")})}document.fonts.ready.then(()=>{document.body.classList.add("fonts-loaded")}),$(document).ready(function(){hljs&&hljs.highlightAll(),fetchGitHubData();const questions=document.querySelectorAll(".faq-question");questions.forEach(question=>{question.addEventListener("click",()=>{var answer=question.nextElementSibling,isActive=question.classList.contains("active");questions.forEach(q=>{q.classList.remove("active"),q.nextElementSibling.classList.remove("active")}),isActive||(question.classList.add("active"),answer.classList.add("active"))})})});