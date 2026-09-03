---
layout: page
footer: false
---

<div class="home-band home-band-light">
  <div class="home-content">

<HeroSection />

<LatestPostsHeader />

<div class="home-body">
  <div class="home-main">
    <LatestPosts :limit="5" />
  </div>
  <aside class="home-aside">
    <AboutCard />
    <CategoryList />
    <ProjectLinks />
  </aside>
</div>

  </div>
</div>

<div class="home-band home-band-muted">
  <div class="home-content">

<LatestNotes :limit="3" />

  </div>
</div>
