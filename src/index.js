(async function myBlog() {

  const postsContainer = document.getElementById('blog-post');
  const filterInput = document.getElementById('search-input');
  const loader = document.getElementById('loader');

  let pageNumber = 1;
  const limitPosts = 12;
  const posts = [];
  let isLoading = false;
  let autoScroll = true; 

  function enableAutoScroll() {
    autoScroll = true;
  }

  function disableAutoScroll() {
    autoScroll = false;
  }

  async function getPosts(page) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limitPosts}&_page=${page}`);
      
      if (!response.ok) {
        alert('no response from the network');
      }

      return await response.json();
    } catch (error) {
      alert('Problem with the fetch operation: ' + error);
    }
  }

  async function loadMorePosts() {
    try {

      const res = await getPosts(pageNumber);
      posts.push(...res);
      await renderPosts(res);
      pageNumber++;

    } catch (error) {
      alert('Problem with the fetch operation: ' + error);
    } 
    
  }

  async function renderPosts(data) {

    data.forEach(post => {
      const postElement = document.createElement("div");

      postElement.classList.add("blog-post");
      postElement.innerHTML = `
        <div class="post-id">${post.id}</div>
        <div class="post-title">${post.title}</div>
        <div class="post-description">${post.body}</div>
      `;

      postsContainer.appendChild(postElement);
    });
  }

  await loadMorePosts();

  document.addEventListener('scroll', () => {
    if (autoScroll && !isLoading && window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
      isLoading = true;
      loader.style.display = 'block'; 

    setTimeout(() => {
      loadMorePosts().then(() => {
        isLoading = false;
        loader.style.display = 'none'; 
      });
    }, 1000)

    }
  });

  function filterPosts(keyword) {
    const filteredPosts = posts.filter(post => {
      const titleIncludesKeyword = post.title.toLowerCase().includes(keyword.toLowerCase());
      const bodyIncludesKeyword = post.body.toLowerCase().includes(keyword.toLowerCase());
      return titleIncludesKeyword || bodyIncludesKeyword;
    });

    postsContainer.innerHTML = '';
    renderPosts(filteredPosts);
  }

  filterInput.addEventListener('input', () => {
    const keyword = filterInput.value;
    if (keyword.trim() === '') {
      postsContainer.innerHTML = '';
      renderPosts(posts);
      enableAutoScroll();
    } else {
      filterPosts(keyword);
      disableAutoScroll()
    }
  });

})();