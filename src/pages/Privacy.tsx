import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <h1 className="text-3xl font-bold mb-8 text-primary">Нууцлалын бодлого</h1>

                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm space-y-6 text-sm leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold mb-3">1. Мэдээлэл цуглуулах</h2>
                        <p>
                            "dt-trading" нь хэрэглэгчид үйлчилгээ үзүүлэх зорилгоор дараах хувийн мэдээллийг цуглуулна:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Овог, Нэр</li>
                            <li>Утасны дугаар, Имэйл хаяг</li>
                            <li>Захиалгын мэдээлэл</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">2. Мэдээлэл ашиглах зорилго</h2>
                        <p>
                            Цуглуулсан мэдээллийг дараах зорилгоор ашиглана:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Хэрэглэгчтэй холбоо барих, зөвлөгөө өгөх</li>
                            <li>Захиалгыг баталгаажуулах, гүйцэтгэх</li>
                            <li>Шинэ бүтээгдэхүүн, үйлчилгээний талаар мэдээлэл хүргэх</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">3. Мэдээллийн аюулгүй байдал</h2>
                        <p>
                            Бид хэрэглэгчийн хувийн мэдээллийг гуравдагч этгээдэд задруулахгүй, худалдахгүй бөгөөд аюулгүй байдлыг хангах техникийн арга хэмжээг авч ажиллана.
                            Зөвхөн хуулийн байгууллагын албан ёсны шаардлагаар мэдээллийг гаргаж өгч болно.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">4. Мэдээлэл устгах</h2>
                        <p>
                            Хэрэглэгч хүсэлт гаргасан тохиолдолд өөрийн бүртгэлтэй мэдээллийг системээс устгуулах эрхтэй.
                            Үүний тулд доорх холбоо барих сувгаар бидэнд хандана уу.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">5. Холбоо барих</h2>
                        <p>
                            Нууцлалын бодлоготой холбоотой асуулт, хүсэлтийг доорх хаягаар хүлээн авна.
                        </p>
                        <div className="mt-2 text-slate-600 dark:text-slate-400 font-medium">
                            <p>dt-trading</p>
                            <p>Хувийн мэдээлэл хариуцсан ажилтан</p>
                            <p>Утас: 010 5727 9927</p>
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
