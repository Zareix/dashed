type Bookmark = {
	id: string;
	createdAt: string;
	modifiedAt: string;
	title: string;
	archived: true;
	favourited: true;
	taggingStatus: string;
	summarizationStatus: string;
	note: string;
	summary: string;
	tags: Array<{
		id: string;
		name: string;
		attachedBy: string;
	}>;
	content:
		| {
				type: "link";
				url: string;
				title: string;
				description: string;
				imageUrl: string;
				imageAssetId: string;
				screenshotAssetId: string;
				fullPageArchiveAssetId: string;
				precrawledArchiveAssetId: string;
				videoAssetId: string;
				favicon: string;
				htmlContent: string;
				contentAssetId: string;
				crawledAt: string;
				author: string;
				publisher: string;
				datePublished: string;
				dateModified: string;
		  }
		| {
				type: "text";
				text: string;
				sourceUrl: string;
		  }
		| {
				type: "asset";
				assetId: string;
				fileName: string;
				sourceUrl: string;
				size: number;
				content: string;
		  }
		| {
				type: "unknown";
		  };
	assets: [
		{
			id: string;
			assetType: string;
		},
	];
};

export type KarakeepBookmarksResponse = {
	bookmarks: Array<Bookmark>;
	nextCursor: string;
};

export type KarakeepListsResponse = {
	lists: Array<{
		type: "manual" | "smart";
		id: string;
		name: string;
		description?: string;
		icon: string;
		parentId?: string;
		query?: string;
		public: boolean;
	}>;
};
