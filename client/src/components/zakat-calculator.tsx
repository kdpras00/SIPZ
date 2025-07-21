import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator, Save, Calendar, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  calculateZakatPenghasilan, 
  calculateZakatEmas, 
  calculateZakatPerdagangan,
  calculateZakatPertanian,
  formatCurrency,
  formatNumber
} from "@/lib/zakat-calculator";

const penghasilanSchema = z.object({
  monthlyIncome: z.string().min(1, "Penghasilan bulanan harus diisi"),
  debt: z.string().optional().default("0"),
});

const emasSchema = z.object({
  goldWeight: z.string().min(1, "Berat emas harus diisi"),
  goldPrice: z.string().min(1, "Harga emas harus diisi"),
});

const perdaganganSchema = z.object({
  businessAssets: z.string().min(1, "Aset usaha harus diisi"),
  debt: z.string().optional().default("0"),
});

const pertanianSchema = z.object({
  farmOutput: z.string().min(1, "Hasil pertanian harus diisi"),
  irrigationType: z.enum(["natural", "artificial"]),
});

type ZakatType = "penghasilan" | "emas" | "perdagangan" | "pertanian";

export default function ZakatCalculator() {
  const [activeType, setActiveType] = useState<ZakatType>("penghasilan");
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: nisabData } = useQuery({
    queryKey: ["/api/nisab"],
  });

  const saveCalculationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/zakat/calculate", data);
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Perhitungan zakat telah disimpan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/zakat/calculations"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan perhitungan",
        variant: "destructive",
      });
    },
  });

  const schedulePaymentMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/zakat/schedule", data);
    },
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Pembayaran zakat telah dijadwalkan",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/zakat/payments"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menjadwalkan pembayaran",
        variant: "destructive",
      });
    },
  });

  const penghasilanForm = useForm({
    resolver: zodResolver(penghasilanSchema),
    defaultValues: {
      monthlyIncome: "",
      debt: "0",
    },
  });

  const emasForm = useForm({
    resolver: zodResolver(emasSchema),
    defaultValues: {
      goldWeight: "",
      goldPrice: nisabData?.goldPrice?.toString() || "1000000",
    },
  });

  const perdaganganForm = useForm({
    resolver: zodResolver(perdaganganSchema),
    defaultValues: {
      businessAssets: "",
      debt: "0",
    },
  });

  const pertanianForm = useForm({
    resolver: zodResolver(pertanianSchema),
    defaultValues: {
      farmOutput: "",
      irrigationType: "natural" as const,
    },
  });

  const parseNumber = (value: string) => {
    return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
  };

  const handleCalculate = (values: any) => {
    let result;
    let calculationData: any = {
      type: activeType,
    };

    switch (activeType) {
      case "penghasilan":
        const monthlyIncome = parseNumber(values.monthlyIncome);
        const debt = parseNumber(values.debt);
        result = calculateZakatPenghasilan(
          { monthlyIncome, debt },
          nisabData?.goldPrice * nisabData?.goldNisab || 85000000
        );
        calculationData = {
          ...calculationData,
          monthlyIncome: monthlyIncome.toString(),
          yearlyIncome: (monthlyIncome * 12).toString(),
          debt: (debt * 12).toString(),
          zakatAmount: result.zakatAmount.toString(),
          isWajib: result.isWajib,
        };
        break;

      case "emas":
        const goldWeight = parseNumber(values.goldWeight);
        const goldPrice = parseNumber(values.goldPrice);
        result = calculateZakatEmas({ goldWeight, goldPrice });
        calculationData = {
          ...calculationData,
          goldWeight: goldWeight.toString(),
          goldPrice: goldPrice.toString(),
          zakatAmount: result.zakatAmount.toString(),
          isWajib: result.isWajib,
        };
        break;

      case "perdagangan":
        const businessAssets = parseNumber(values.businessAssets);
        const businessDebt = parseNumber(values.debt);
        result = calculateZakatPerdagangan(
          { businessAssets, debt: businessDebt },
          nisabData?.goldPrice * nisabData?.goldNisab || 85000000
        );
        calculationData = {
          ...calculationData,
          businessAssets: businessAssets.toString(),
          debt: businessDebt.toString(),
          zakatAmount: result.zakatAmount.toString(),
          isWajib: result.isWajib,
        };
        break;

      case "pertanian":
        const farmOutput = parseNumber(values.farmOutput);
        result = calculateZakatPertanian({ 
          farmOutput, 
          irrigationType: values.irrigationType 
        });
        calculationData = {
          ...calculationData,
          farmOutput: farmOutput.toString(),
          irrigationType: values.irrigationType,
          zakatAmount: result.zakatAmount.toString(),
          isWajib: result.isWajib,
        };
        break;
    }

    setCalculationResult({ ...result, calculationData });
  };

  const handleSave = () => {
    if (calculationResult) {
      saveCalculationMutation.mutate(calculationResult.calculationData);
    }
  };

  const handleSchedule = () => {
    if (calculationResult) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1); // Default to next month
      
      schedulePaymentMutation.mutate({
        type: activeType,
        amount: calculationResult.zakatAmount.toString(),
        dueDate: dueDate.toISOString(),
        calculationId: null, // Will be set after saving calculation
        status: "scheduled",
      });
    }
  };

  const renderCalculationForm = () => {
    switch (activeType) {
      case "penghasilan":
        return (
          <Form {...penghasilanForm}>
            <form onSubmit={penghasilanForm.handleSubmit(handleCalculate)} className="space-y-6">
              <FormField
                control={penghasilanForm.control}
                name="monthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penghasilan Bersih per Bulan (Rp)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 10.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={penghasilanForm.control}
                name="debt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hutang/Cicilan per Bulan (Rp)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 2.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-islamic-600 hover:bg-islamic-700">
                <Calculator className="w-4 h-4 mr-2" />
                Hitung Zakat
              </Button>
            </form>
          </Form>
        );

      case "emas":
        return (
          <Form {...emasForm}>
            <form onSubmit={emasForm.handleSubmit(handleCalculate)} className="space-y-6">
              <FormField
                control={emasForm.control}
                name="goldWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Berat Emas (gram)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emasForm.control}
                name="goldPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga Emas per Gram (Rp)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 1.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-islamic-600 hover:bg-islamic-700">
                <Calculator className="w-4 h-4 mr-2" />
                Hitung Zakat
              </Button>
            </form>
          </Form>
        );

      case "perdagangan":
        return (
          <Form {...perdaganganForm}>
            <form onSubmit={perdaganganForm.handleSubmit(handleCalculate)} className="space-y-6">
              <FormField
                control={perdaganganForm.control}
                name="businessAssets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Aset Usaha (Rp)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 500.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={perdaganganForm.control}
                name="debt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hutang Usaha (Rp)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 50.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-islamic-600 hover:bg-islamic-700">
                <Calculator className="w-4 h-4 mr-2" />
                Hitung Zakat
              </Button>
            </form>
          </Form>
        );

      case "pertanian":
        return (
          <Form {...pertanianForm}>
            <form onSubmit={pertanianForm.handleSubmit(handleCalculate)} className="space-y-6">
              <FormField
                control={pertanianForm.control}
                name="farmOutput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hasil Pertanian (Rp)</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 100.000.000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={pertanianForm.control}
                name="irrigationType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis Pengairan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis pengairan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="natural">Alami (Hujan) - 10%</SelectItem>
                        <SelectItem value="artificial">Buatan (Irigasi) - 5%</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-islamic-600 hover:bg-islamic-700">
                <Calculator className="w-4 h-4 mr-2" />
                Hitung Zakat
              </Button>
            </form>
          </Form>
        );
    }
  };

  const getZakatInfo = () => {
    switch (activeType) {
      case "penghasilan":
        return {
          title: "Ketentuan Zakat Penghasilan",
          points: [
            "Nisab: setara 85 gram emas",
            "Kadar zakat: 2.5% dari penghasilan bersih",
            "Dikurangi kebutuhan pokok dan hutang",
          ],
        };
      case "emas":
        return {
          title: "Ketentuan Zakat Emas",
          points: [
            "Nisab: 85 gram emas",
            "Kadar zakat: 2.5% dari nilai emas",
            "Dimiliki selama 1 tahun (haul)",
          ],
        };
      case "perdagangan":
        return {
          title: "Ketentuan Zakat Perdagangan",
          points: [
            "Nisab: setara 85 gram emas",
            "Kadar zakat: 2.5% dari aset bersih",
            "Termasuk modal dan keuntungan",
          ],
        };
      case "pertanian":
        return {
          title: "Ketentuan Zakat Pertanian",
          points: [
            "Nisab: 5 wasaq (≈ 653 kg beras)",
            "Pengairan alami: 10%",
            "Pengairan buatan: 5%",
          ],
        };
      default:
        return { title: "", points: [] };
    }
  };

  const zakatInfo = getZakatInfo();

  return (
    <section id="calculator" className="mb-12">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-islamic-600 to-islamic-700 text-white">
          <CardTitle className="flex items-center">
            <Calculator className="mr-3" />
            Kalkulator Zakat
          </CardTitle>
          <p className="text-islamic-100 text-sm">Hitung zakat sesuai syariat Islam</p>
        </CardHeader>

        <CardContent className="p-6">
          {/* Zakat Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            {[
              { key: "penghasilan", label: "Penghasilan" },
              { key: "emas", label: "Emas & Perak" },
              { key: "perdagangan", label: "Perdagangan" },
              { key: "pertanian", label: "Pertanian" },
            ].map((type) => (
              <Button
                key={type.key}
                variant={activeType === type.key ? "default" : "ghost"}
                className={`rounded-t-lg rounded-b-none ${
                  activeType === type.key 
                    ? "bg-islamic-600 text-white border-b-2 border-islamic-600" 
                    : "text-gray-600 hover:text-islamic-600"
                }`}
                onClick={() => setActiveType(type.key as ZakatType)}
              >
                {type.label}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Input Data {activeType.charAt(0).toUpperCase() + activeType.slice(1)}
              </h3>
              
              {renderCalculationForm()}

              {/* Info Card */}
              <Card className="mt-6 bg-islamic-50 border-islamic-200">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Info className="text-islamic-600 mt-0.5 flex-shrink-0" size={16} />
                    <div>
                      <h4 className="text-sm font-medium text-islamic-800 mb-1">
                        {zakatInfo.title}
                      </h4>
                      <ul className="text-xs text-islamic-700 space-y-1">
                        {zakatInfo.points.map((point, index) => (
                          <li key={index}>• {point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hasil Perhitungan</h3>
              
              <Card className="bg-gradient-to-br from-islamic-50 to-islamic-100 border-islamic-200">
                <CardContent className="p-6">
                  {calculationResult ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-islamic-200">
                        <span className="text-sm text-gray-600">Jumlah Bersih:</span>
                        <span className="font-medium">{formatCurrency(calculationResult.netAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-islamic-200">
                        <span className="text-sm text-gray-600">Nisab:</span>
                        <span className="font-medium">{formatCurrency(calculationResult.nisabAmount)}</span>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 border-2 border-islamic-300">
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-1">Wajib Zakat:</p>
                          <Badge variant={calculationResult.isWajib ? "default" : "secondary"}>
                            {calculationResult.isWajib ? "Ya" : "Tidak"}
                          </Badge>
                        </div>
                      </div>
                      
                      {calculationResult.isWajib && (
                        <>
                          <div className="bg-gradient-to-r from-gold-400 to-gold-500 rounded-lg p-4 text-white">
                            <div className="text-center">
                              <p className="text-sm opacity-90 mb-1">
                                Jumlah Zakat ({formatNumber(calculationResult.zakatRate * 100)}%):
                              </p>
                              <p className="text-3xl font-bold">
                                {formatCurrency(calculationResult.zakatAmount)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <Button 
                              onClick={handleSave}
                              disabled={saveCalculationMutation.isPending}
                              className="bg-islamic-600 hover:bg-islamic-700"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {saveCalculationMutation.isPending ? "Menyimpan..." : "Simpan"}
                            </Button>
                            <Button 
                              onClick={handleSchedule}
                              disabled={schedulePaymentMutation.isPending}
                              className="bg-gold-600 hover:bg-gold-700"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              {schedulePaymentMutation.isPending ? "Menjadwalkan..." : "Jadwalkan"}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calculator className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>Masukkan data untuk menghitung zakat</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
