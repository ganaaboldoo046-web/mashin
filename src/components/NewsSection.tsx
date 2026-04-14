import Image from './Image';

export default function NewsSection() {
    return (
        <section className="mt-8 px-4">
            <div className="relative w-full h-40 rounded-2xl overflow-hidden">
                <Image
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD34mCUdIXJSFeHbEeTtaMXmGxVrqAbHHCpnUmQ4SRnBMkkQmBFOteHNTnlA1lKCD-BMHDomozA-Co_ryxiPo9qDhZjoXNlbdwP_cw6AwT2nzxvAPpn4qyteEds3MyP4QnsGEP66Y7IxyzCKFRHpqTWCa8XD225kNhEeZ-d1VE9SwpjBNyzE9M7psYcsve5Z_l_-sin4gyDXJG7MBR6GzCGzRWO66LUJuZG99FL-dipJ9AcEdbf5ekvVHoNeyBmQjyb6AcJ9zx6Iro"
                    alt="Modern electric car charging station background"
                    size="medium"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center p-6">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded w-fit mb-2 uppercase">Мэдээ</span>
                    <h3 className="text-white text-xl font-bold leading-tight">EV2 удахгүй худалдаанд гарна!<br />Цахилгаан машины шинэ эрин</h3>
                </div>
            </div>
        </section>
    );
}
