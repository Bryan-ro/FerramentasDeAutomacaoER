declare namespace emailFormtat {

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
        broadcasters: number[];
    }
}
