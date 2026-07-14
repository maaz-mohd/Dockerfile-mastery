# Java / Spring Boot — Maven build then JRE-only runtime

```bash
docker build -t java-demo .
docker run java-demo
```
This skeleton demonstrates the pattern with a plain `App.java`; swap in a real
Spring Boot project (`pom.xml` with `spring-boot-maven-plugin`, `@SpringBootApplication`
main class) and the same two-stage shape applies unchanged: Maven build stage → JRE-only runtime.

Final image ships only the JRE and the fat jar — no Maven, no source, no build cache.
