<script>
  const availableLinks = [
    {
      title: 'Sign in',
      url: '/sign-in',
    },
  ];
</script>

<h1>Hello Attar!</h1>

{#each availableLinks as link (link.url)}
  <a href={link.url}>{link.title}</a>
{/each}
