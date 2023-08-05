declare namespace emailFormat {

    interface mediaInfosProps  {
        title: string;
        clock: string;
        duration: number;
        advertiser: string;
        link: string;
    }

    interface emailProps {
        mediaInfos: mediaInfosProps[];
        advertiser: string;
        PointOfSaleIsRj: boolean;
        broadcasters: number[];
    }

    interface mediaInfosPropsBand  {
        title: string;
        clock: string;
        duration: number;
        advertiser: string;
        linkMxf?: string;
        linkMov?: string;
        linkMp4?: string;
    }

    interface emailPropsBand {
        mediaInfos: mediaInfosPropsBand[];
        advertiser: string;
        broadcasters: number[];
    }
}
