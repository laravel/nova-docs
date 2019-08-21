module.exports = (options = {}, context) => ({
    extendPageData ($page) {
        const { regularPath, frontmatter  } = $page

        frontmatter.meta = []

        if ($page.regularPath.includes('/1.0/')) {
            frontmatter.meta.push({
                name: 'docsearch:version',
                content: '1.0.0'
            })
        } else if ($page.regularPath.includes('/2.0/')) {
            frontmatter.meta.push({
                name: 'docsearch:version',
                content: '2.0.0'
            })
        }
    }
})
