import mailTransporter from "./mailTransporter";

export default async (
    email: string,
    pass: string,
    name: string,
    from: string,
    to: string,
    PointOfSaleIsRj: boolean,
    advertiser: string,
    broadcaster: string,
    infos: emailFormtat.emailProps
) => {

    let mediaInfos = "";
    let template = "";

    if(PointOfSaleIsRj) {
        to += "; bryanadstream9@gmail.com";
    }

    for (const i in infos.mediaInfos) {
        if(!infos.mediaInfos[i].clock || !infos.mediaInfos[i].duration || !infos.mediaInfos[i].title || !infos.mediaInfos[i].link)
            throw new Error("Preencha todos os campos para enviar os materiais aos destinos.");
        mediaInfos += `
        <table>
            <tr class="tittle">
                <td>Destino</td>
                <td>Clock Number</td>
                <td>Duração</td>
                <td>Titulo</td>
                <td>Link</td>
            </tr>
            <tr class="infos">
                <td>${broadcaster}</td>
                <td>${infos.mediaInfos[i].clock}</td>
                <td>${infos.mediaInfos[i].duration}</td>
                <td>${infos.mediaInfos[i].title}</td>
                <td><a href="${infos.mediaInfos[i].link}">DOWNLOAD</a></td>
            </tr>
        </table>
        <br>
        <br>
        `;
    }

    if(mediaInfos !== "") {
        template = `
            Olá, tudo bem?
            <br>
                <br>
            Segue abaixo a entrega do material da anunciante ${advertiser}:
            <br>
            <br>
            ${mediaInfos}

            Favor confirmar o recebimento.
            <br>
            <br>
            `;
    }

    if(mediaInfos !== "") await mailTransporter(email, pass).sendMail({
        from: from,
        to: to,
        cc: "bryanlegaldarocha@gmail.com",
        subject: `Entrega de material - ${advertiser} - ${broadcaster}`,
        html: `
        <head>
            <style>
    * {
        font-size: 14px;
    }

    body {
        background-color: black;
    }

    table {
        display: flex;
        flex-wrap: wrap;
        font-family: sans-serif;
        text-align: center;
    }

    td, table {
        border-collapse: collapse;
        width: 750px;
    }

    td {
        border: 1px solid white;
    }

    .tittle {
        height: 20px;
        background-color: #77aadd;
        font-weight: bold;
    }

    .infos {
        background-color: #cccccc;
    }

    a {
        text-decoration: none;
        color: #2074c9;
    }

</style>
  </head>
  <body>
  ${template}
    <br>
    <br>
    <div style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; background-color: rgb(255, 255, 255);">Abs,</div>
<div style="color: rgb(34, 34, 34); font-family: Arial, Helvetica, sans-serif; font-size: small; background-color: rgb(255, 255, 255);">
<p dir="ltr" style="color: rgb(34, 34, 34); line-height: 1.38; margin-top: 0pt; margin-bottom: 0pt;"><span style="font-size: 11pt; font-family: Arial; vertical-align: baseline; white-space: pre-wrap;"><span style="border-style: none; display: inline-block; overflow: hidden; width: 100px; height: 32px;"><img src="https://lh6.googleusercontent.com/wCUnK4Awh1DmZwgnhLdrhx8lNsAkdLwvwxcm0M2SLyZSvtE98mfAzKSI1UZu2GM1Ue6oyx2HVFbNB2az4Q8ZWg5C-2Gn6A1IV3sqXWnxQKeNLYnH10oxeyrtXw9VAa3Utg571x4n" alt="Extreme Reach" width="100" height="32" data-bit="iit"></span></span></p>
<div style="margin: 0px; padding: 0px; border-width: 0px; font-stretch: inherit; font-size: 12pt; line-height: inherit; font-family: Calibri, Arial, Helvetica, sans-serif; vertical-align: baseline; color: rgb(0, 0, 0);"><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); font-weight: bold; vertical-align: baseline; white-space: pre-wrap;">${name}<br></span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;"><strong>Traffic Assistant</strong><br></span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;"><br></span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); font-weight: bold; vertical-align: baseline; white-space: pre-wrap;">M:</span><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;"> </span><span style="color: rgb(16, 24, 32); font-family: Arial; font-size: 12px; white-space: pre-wrap;"> 55 11 98892-5295</span></div>
<div style="margin: 0px; padding: 0px; border-width: 0px; font-stretch: inherit; font-size: 14px; line-height: inherit; vertical-align: baseline; color: rgb(0, 0, 0);"><a style="color: rgb(17, 85, 204); font-family: Arial; font-size: 9pt; white-space: pre-wrap;" href="mailto:${email}" target="_blank" rel="noopener">${email}</a></div>
<p dir="ltr" style="color: rgb(34, 34, 34); line-height: 1.62; margin-top: 0pt; margin-bottom: 0pt; padding: 15pt 0pt 0pt;"><span style="font-size: 9pt; font-family: Arial; color: rgb(16, 24, 32); vertical-align: baseline; white-space: pre-wrap;">Adstream Brasil (an Extreme Reach company)</span></p>
<div>&nbsp;</div>
<div><img class="CToWUd a6T" style="cursor: pointer; outline-width: 0px;" tabindex="0" src="https://lh3.googleusercontent.com/Ujl148-8lEgohZsNH_Fb18WEhRRtQL4N6zhiUI8P8iOqfrf7XuzM5gGaPuZVffa5HLS-sH25siPnW4n_h3JK0HGbBamp-8wLfG5GjZJVAJHHQNS4OByP09aesSTz3L8KTg_oMgUVGUk4UH9JHGQqevY" width="420" height="138" data-bit="iit"></div>

  </body>

        `
    });
};


