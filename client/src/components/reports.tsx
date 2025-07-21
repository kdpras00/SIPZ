import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Download, HandHeart, Heart, Banknote, Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/zakat-calculator";

export default function Reports() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data: summary } = useQuery({
    queryKey: ["/api/reports/summary", selectedYear],
  });

  const { data: transactionsData } = useQuery({
    queryKey: ["/api/reports/transactions", selectedYear, currentPage.toString(), limit.toString()],
  });

  const handleExportReport = () => {
    // In a real app, this would generate and download a PDF
    console.log("Exporting report for year", selectedYear);
  };

  const formatTransactionDate = (transaction: any) => {
    const date = 'paidDate' in transaction ? 
      (transaction.paidDate || transaction.createdAt) : 
      transaction.date;
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTransactionType = (transaction: any) => {
    if ('type' in transaction) {
      // This is an infaq/shadaqoh record
      return {
        type: transaction.type,
        category: transaction.type,
        variant: transaction.type === 'infaq' ? 'default' : 
                 transaction.type === 'shadaqoh' ? 'secondary' : 'outline'
      };
    } else {
      // This is a zakat payment
      return {
        type: 'Zakat',
        category: transaction.type,
        variant: 'default'
      };
    }
  };

  const getTransactionStatus = (transaction: any) => {
    if ('status' in transaction) {
      switch (transaction.status) {
        case 'paid':
          return { text: 'Selesai', variant: 'default' as const };
        case 'scheduled':
          return { text: 'Terjadwal', variant: 'secondary' as const };
        case 'overdue':
          return { text: 'Terlambat', variant: 'destructive' as const };
        default:
          return { text: transaction.status, variant: 'outline' as const };
      }
    }
    return { text: 'Selesai', variant: 'default' as const };
  };

  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <section id="laporan" className="mb-12">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-3 text-blue-600" />
              Laporan & Riwayat
            </CardTitle>
            <div className="mt-3 sm:mt-0 flex items-center space-x-3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      Tahun {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleExportReport}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-islamic-50 to-islamic-100 border-islamic-200">
              <CardContent className="p-4 text-center">
                <HandHeart className="mx-auto text-2xl text-islamic-600 mb-2 h-8 w-8" />
                <p className="text-sm text-gray-600">Total Zakat</p>
                <p className="text-xl font-bold text-islamic-700">
                  {summary ? formatCurrency(summary.totalZakat) : formatCurrency(0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gold-50 to-gold-100 border-gold-200">
              <CardContent className="p-4 text-center">
                <Heart className="mx-auto text-2xl text-gold-600 mb-2 h-8 w-8" />
                <p className="text-sm text-gray-600">Total Infaq</p>
                <p className="text-xl font-bold text-gold-700">
                  {summary ? formatCurrency(summary.totalInfaq) : formatCurrency(0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 text-center">
                <Banknote className="mx-auto text-2xl text-blue-600 mb-2 h-8 w-8" />
                <p className="text-sm text-gray-600">Total Shadaqoh</p>
                <p className="text-xl font-bold text-blue-700">
                  {summary ? formatCurrency(summary.totalShadaqoh) : formatCurrency(0)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4 text-center">
                <Calculator className="mx-auto text-2xl text-purple-600 mb-2 h-8 w-8" />
                <p className="text-sm text-gray-600">Total Transaksi</p>
                <p className="text-xl font-bold text-purple-700">
                  {summary ? `${summary.totalTransactions} kali` : "0 kali"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Penerima</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactionsData?.transactions && transactionsData.transactions.length > 0 ? (
                  transactionsData.transactions.map((transaction: any) => {
                    const transactionType = getTransactionType(transaction);
                    const status = getTransactionStatus(transaction);
                    
                    return (
                      <TableRow key={transaction.id} className="hover:bg-gray-50">
                        <TableCell>{formatTransactionDate(transaction)}</TableCell>
                        <TableCell>
                          <Badge variant={transactionType.variant as any} className="capitalize">
                            {transactionType.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{transactionType.category}</TableCell>
                        <TableCell>{transaction.recipient || '-'}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(Number(transaction.amount))}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={status.variant}>
                            {status.text}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Tidak ada transaksi untuk tahun {selectedYear}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {transactionsData && transactionsData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-700">
                Menampilkan{" "}
                <span className="font-medium">
                  {(currentPage - 1) * limit + 1}
                </span>{" "}
                hingga{" "}
                <span className="font-medium">
                  {Math.min(currentPage * limit, transactionsData.total)}
                </span>{" "}
                dari{" "}
                <span className="font-medium">{transactionsData.total}</span>{" "}
                transaksi
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {Array.from({ length: Math.min(5, transactionsData.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={currentPage === pageNum ? "bg-islamic-600 hover:bg-islamic-700" : ""}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, transactionsData.totalPages))}
                  disabled={currentPage === transactionsData.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
