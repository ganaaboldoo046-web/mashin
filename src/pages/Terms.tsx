import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DT_CONTACT, DT_PHONE_SUMMARY } from '../constants/contact';

export default function Terms() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-primary">Үйлчилгээний нөхцөл</h1>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold mb-3">1. Нийтлэг үндэслэл</h2>
                        <p>
                            Энэхүү үйлчилгээний нөхцөл нь "DT Trading" (цаашид "Компани" гэх)-ийн үзүүлж буй автомашин худалдаа, зуучлалын үйлчилгээг хэрэглэгч ашиглахтай холбоотой харилцааг зохицуулна.
                            Хэрэглэгч манай үйлчилгээг ашигласнаар энэхүү нөхцөлийг хүлээн зөвшөөрсөнд тооцогдоно.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">2. Үйлчилгээний төрөл</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>БНСУ-аас автомашин худалдан авах зуучлал</li>
                            <li>Автомашины тээвэрлэлт, гаалийн бүрдүүлэлтийн зөвлөгөө</li>
                            <li>Захиалгын дагуу автомашин хайх, шалгах</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">3. Захиалга ба Төлбөр</h2>
                        <p>
                            Хэрэглэгч вэбсайтаар дамжуулан автомашин захиалах хүсэлт илгээх боломжтой. Захиалга баталгаажсаны дараа төлбөрийн нөхцөлийг талууд харилцан тохиролцоно.
                            Захиалга цуцлах тохиолдолд гарсан зардлыг хэрэглэгч хариуцна.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">4. Хариуцлага</h2>
                        <p>
                            Компани нь автомашины бодит байдал, техникийн үзүүлэлтийг үнэн зөв мэдээлэх үүрэгтэй.
                            Гэвч байгалийн давагдашгүй хүчин зүйл, тээвэрлэлтийн явцад үүссэн хохиролд компани шууд хариуцлага хүлээхгүй.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">5. Холбоо барих</h2>
                        <p>
                            Үйлчилгээтэй холбоотой санал хүсэлт, гомдлыг доорх хаягаар хүлээн авна.
                        </p>
                        <div className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
                            <p>DT Trading</p>
                            <p>Утас: {DT_PHONE_SUMMARY}</p>
                            <p>Имэйл: <a href={DT_CONTACT.email.href} className="hover:text-primary hover:underline">{DT_CONTACT.email.display}</a></p>
                        </div>
                    </section>
                </div>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-primary font-bold hover:underline">Нүүр хуудас руу буцах</Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
