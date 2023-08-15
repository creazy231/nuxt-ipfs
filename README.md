# Nuxt + IPFS
As a developer at [Qwellcode](https://twitter.com/qwellcode), I'm excited to delve into the technical implementation of the [MOCA Fundraiser](https://hackmd.io/@reneil1337/fundraiser) that I've been dedicatedly working on in recent weeks.

This article primarily centers around detailing the frontend execution and the seamless integration between **[Nuxt](https://nuxt.com/) + [IPFS](https://ipfs.tech/)**.


![](https://hackmd.io/_uploads/ByDkwvdnn.jpg)


## Static Hosting (SSG)
Like many other frameworks, Nuxt also provides the ability to statically host your project. This is a fundamental requirement for projects that are intended to be hosted on IPFS afterward.

You can find more comprehensive details about Static Hosting with Nuxt [here](https://nuxt.com/docs/getting-started/deployment#static-hosting).


## The Issue with `/ipfs/`
As a small example, this is what a link to a file or webpage on IPFS looks like: `https://ipfs.io/ipfs/QmX2PdwoawfEXtRKqkomLRastXTanLa7uaEXdXADqCaDSn`.

As evident from this example, a statically hosted webpage would be located in the subdirectory `/ipfs/QmX2PdwoawfEXtRKqkomLRastXTanLa7uaEXdXADqCaDSn`. However, Nuxt employs absolute paths that, in this case, would assume the webpage is accessible via the URL `https://ipfs.io/`, which is not the case, as shown in the above example.

Now, one might naturally assume that setting the Base URL using the `<base>` tag would suffice. However, for various reasons, that's not the case.


## Finding a Solution
I've experimented with various methods to make a Nuxt project work seamlessly when hosted on IPFS. I'll walk you through what I've tried, but regrettably, none of these attempts have yielded a comprehensive solution that works flawlessly.

### Setting the `baseURL`
As I mentioned before, my initial idea was to set the `baseURL` of the website in order to inform Nuxt that the webpage is not hosted at `https://ipfs.io/`, but rather in an imaginary subdirectory. While this approach might work for regular websites, it encounters a significant problem when hosted on IPFS: you don't know the IPFS hash prior to uploading. Therefore, you cannot predefine it. Consequently, I quickly abandoned this idea as well.

### Nitro App Hooks
After struggling to get the website up and running through a simple configuration, I decided to delve into the [Nitro App Hooks](https://nuxt.com/docs/guide/going-further/hooks#nitro-app-hooks-runtime). These hooks allow manipulation of webpage output, and the two key ones are `render:html` and `render:response`. Leveraging these hooks, I modified the rendered HTML page so that all paths became relative to the current URL, rather than being "relative" to the website's base URL.

I also attempted to dynamically set the base URL using these hooks afterward, but unfortunately, this approach also did not yield the desired outcome.

### Returning to Configuration
After all the unsuccessful experiments listed above, I made the decision to revisit the configuration of Nuxt and Nitro. I systematically explored all potential configurations of Nuxt and Nitro to determine which of them could be beneficial for achieving my objectives.

And behold - it works! Finally!

## Solution 🚀
The solution comprises a combination of various configurations. Particularly highlighted are the two aspects: `runtimeConfig.app.baseURL` and `router.options.hashMode`. It turns out it can be that simple after all 🥲

With the following configuration in the `nuxt.config.ts` file, the project functions seamlessly both in the local development environment and when hosted on IPFS:

```javascript
export default {
  runtimeConfig: {
    app: {
      baseURL: process.env.NODE_ENV === "development" ? "/" : "./",
    },
  },

  router: {
    options: {
      hashMode: process.env.NODE_ENV !== "development",
    },
  },
    
  // ...other configurations
}
```

Now, you can generate a static page using the following command...
```bash
npx nuxi generate
```

... and then upload the `.output/public` directory to IPFS using services like Pinata, for instance.

## Do Plugins and Modules Work?
In short - Yes! Based on the example of the [MOCA Fundraiser](https://moca.mypinata.cloud/ipfs/QmX2PdwoawfEXtRKqkomLRastXTanLa7uaEXdXADqCaDSn) project, I've tested the following modules and can confirm that they work seamlessly:

```
@nuxtjs/tailwindcss
@nuxt/image
@vueuse/nuxt
nuxt-seo-kit (with some restrictions due to SSR/SSG)
```

Naturally, many other modules and plugins will also work. This list simply highlights the ones I've utilized in this case.

View the MOCA Fundraiser Collection hosted on IPFS using Nuxt: https://moca.mypinata.cloud/ipfs/QmX2PdwoawfEXtRKqkomLRastXTanLa7uaEXdXADqCaDSn

## Sample Repository
GitHub: https://github.com/creazy231/nuxt-ipfs

Website: https://ipfs.io/ipfs/QmNrRzfd3STcLEvVxBTYCikFSKZH8H3C1EB5xj25Fn3sut