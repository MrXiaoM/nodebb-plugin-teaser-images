'use strict';

const plugin = {};
const posts = require.main.require('./src/posts');

plugin['filter:teasers+get'] = async function(hook) {
	// 获取帖子原始内容
	const pids = hook.teasers.filter(teaser => teaser).map(teaser => teaser.pid);
	const allPostData = await posts.getPostsFields(pids, ['pid', 'content']);
	const postData = new Map(allPostData.filter((post) => post && post.pid).map((post) => [post.pid, post]));
	// 通过正则表达式获取图片链接
	const regex = /\!\[.*?\]\((.*?)\)/gi;
	return {
		teasers: hook.teasers.map((teaser) => {
			if (teaser) {
				const content = postData.get(teaser.pid).content;
				if (content) {
					const result = [...content.matchAll(regex)];
					teaser.images = result.map((v) => v[1]).slice(0, 3);
				} else {
					teaser.images = [];
				}
			}
			return teaser;
		})
	};
};

module.exports = plugin;
