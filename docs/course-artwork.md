# Course artwork

The eight additional first-year courses use original AI-generated decorative illustrations, created with the built-in image generator. They are conceptual banners, not instructional diagrams, official course imagery, or photographs of real devices. The original three vector headers remain unchanged.

Online references were consulted to select and review subject relevance; no third-party image was copied, traced, downloaded, or used as a generation input. Illustrations are served locally from `public/course-artwork/`, resized to 768 pixels wide, palette-optimized PNGs. No external image service, tracking, or CSP change is required.

| Asset | Subject | Conceptual reference |
| --- | --- | --- |
| calculus.png | Curve, tangent and area strips | [MIT single-variable calculus](https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/video_galleries/video-lectures/) |
| hci.png | Human sketching paper interface prototypes | [Nielsen Norman Group application design examples](https://media.nngroup.com/media/reports/free/Application_Design_Showcase_2nd_edition.pdf) |
| data-management.png | Relational tables and keys | [PlanetScale relational schema design](https://planetscale.com/blog/schema-design-101-relational-databases) |
| linear-algebra.png | Basis vectors and a transformed grid | [MIT linear transformations](https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/pages/positive-definite-matrices-and-applications/linear-transformations-and-their-matrices/) |
| software-engineering.png | Connected software components and testing | [C4 component diagrams](https://c4model.com/diagrams/component) |
| algorithms.png | Binary tree with highlighted traversal | [Princeton graph algorithms](https://algs4.cs.princeton.edu/40graphs/) |
| probability.png | Histogram, distribution curve and samples | [OpenIntro Statistics](https://www.openintro.org/book/os/) |
| networks.png | Router, Ethernet switches and packet paths | [Cisco networking basics](https://www.cisco.com/site/us/en/learn/topics/small-business/networking-basics.html) |

All images have empty alternative text because their course names are already provided by adjacent headings. Explicit dimensions, fixed-height card headers, asynchronous decoding and lazy loading preserve the existing layout and avoid adding image bytes to the initial JavaScript bundle.
