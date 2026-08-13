import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { DT_PHONE_SUMMARY } from '../constants/contact';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-2 text-primary">Нууцлалын бодлого</h1>
                <p className="mb-8 text-sm text-slate-500">Сүүлд шинэчилсэн: 2026 оны 8 сарын 13</p>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold mb-3">1. Цуглуулах мэдээлэл</h2>
                        <p>DT Trading нь үйлчилгээ үзүүлэхэд шаардлагатай дараах мэдээллийг цуглуулж болно:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Google-ээр нэвтрэх үед Google бүртгэлийн давтагдашгүй ID, нэр, имэйл хаяг, профайлын зураг</li>
                            <li>Захиалга, хүсэлт эсвэл сэтгэгдэлд хэрэглэгчийн өөрөө оруулсан мэдээлэл</li>
                            <li>Нэвтэрсэн төлөвийг хадгалах аюулгүй session cookie</li>
                        </ul>
                        <p className="mt-2">DT Trading нь таны Google нууц үгийг хүлээн авахгүй, хадгалахгүй.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">2. Мэдээлэл ашиглах зорилго</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Хэрэглэгчийг таних, Google нэвтрэлтийг баталгаажуулах</li>
                            <li>Профайл, хадгалсан зар, захиалга болон сэтгэгдлийг хэрэглэгчтэй холбох</li>
                            <li>Хэрэглэгчтэй холбоо барих, автомашины зөвлөгөө, үйлчилгээ үзүүлэх</li>
                            <li>Үйлчилгээний аюулгүй байдал, алдаа болон хууль бус хэрэглээг шалгах</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">3. Google мэдээлэл ба гуравдагч тал</h2>
                        <p>
                            Google нэвтрэлт нь зөвхөн <code>openid</code>, <code>email</code>, <code>profile</code> үндсэн эрхийг ашиглана.
                            Google-ээс ирсэн ID token-ийг сервер дээр шалгасны дараа DT Trading-ийн session үүсгэнэ.
                            Бид Google хэрэглэгчийн мэдээллийг худалдахгүй, зар сурталчилгааны зорилгоор дамжуулахгүй.
                        </p>
                        <p className="mt-2">
                            Үйлчилгээ ажиллуулахад шаардлагатай Google болон Cloudflare зэрэг дэд бүтцийн үйлчилгээ үзүүлэгчид өөрсдийн нөхцөл,
                            нууцлалын бодлогын дагуу өгөгдөл боловсруулж болно. Google-ийн бодлогыг{' '}
                            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" className="font-bold text-primary hover:underline">
                                эндээс үзнэ үү
                            </a>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">4. Хадгалах хугацаа ба устгах хүсэлт</h2>
                        <p>
                            Нэвтрэх session ердийн нөхцөлд 7 хоног хүчинтэй. Профайл, захиалга болон сэтгэгдлийн мэдээллийг үйлчилгээ үзүүлэх,
                            бүртгэл хөтлөх шаардлагатай хугацаанд хадгална. Хэрэглэгч доорх имэйлээр хүсэлт гарган өөрийн мэдээллийг шалгуулах,
                            засуулах эсвэл устгуулах боломжтой. Хуульд заасан хадгалах үүрэгтэй мэдээлэлд тухайн хугацаа үйлчилнэ.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">5. Мэдээллийн аюулгүй байдал</h2>
                        <p>
                            DT Trading нь нэвтрэх token-ийг сервер дээр баталгаажуулах, HttpOnly session cookie ашиглах, дамжуулалтыг HTTPS-ээр
                            хамгаалах зэрэг зохистой техникийн арга хэмжээ авна. Интернэтээр дамжуулах аливаа системд үнэмлэхүй аюулгүй байдлыг
                            батлах боломжгүй ч эрсдэлийг бууруулах арга хэмжээг тогтмол хэрэгжүүлнэ.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">6. Холбоо барих</h2>
                        <p>Нууцлал, Google нэвтрэлт эсвэл мэдээлэл устгах хүсэлтийг дараах хаягаар хүлээн авна:</p>
                        <div className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
                            <p>DT Trading</p>
                            <p>Утас: {DT_PHONE_SUMMARY}</p>
                            <p>Имэйл: temmuntrading@gmail.com</p>
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
