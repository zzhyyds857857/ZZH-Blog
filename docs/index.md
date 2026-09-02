---
layout: page
footer: false
---

<div class="home-content">

<HeroSection />

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

<LatestNotes :limit="3" />

</div>
