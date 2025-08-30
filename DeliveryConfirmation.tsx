import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  CheckCircle,
  Camera,
  PenTool,
  User,
  Package,
  Clock,
  Star,
  DollarSign,
  MapPin,
  Phone,
  MessageSquare,
  AlertCircle,
  CreditCard,
  Receipt,
  ThumbsUp
} from 'lucide-react';

const DeliveryConfirmation: React.FC = () => {
  const [selectedOrder] = useState({
    id: 'ORD001',
    customerName: 'Green Mart Supermarket',
    customerPhone: '+91 9123456789',
    deliveryAddress: 'Sector 18, Noida, UP 201301',
    contactPerson: 'Rajesh Gupta',
    items: [
      { id: 1, name: 'Basmati Rice', quantity: '5 kg', price: 275, delivered: true, condition: 'excellent' },
      { id: 2, name: 'Fresh Tomatoes', quantity: '2 kg', price: 120, delivered: true, condition: 'good' },
      { id: 3, name: 'Organic Wheat', quantity: '3 kg', price: 180, delivered: true, condition: 'excellent' }
    ],
    totalValue: 575,
    deliveryFee: 185,
    paymentMethod: 'Cash on Delivery',
    deliveryTime: new Date().toLocaleTimeString(),
    specialInstructions: 'Handle vegetables with care. Ring doorbell twice.'
  });

  const [deliveryPhotos, setDeliveryPhotos] = useState<string[]>([]);
  const [customerSignature, setCustomerSignature] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [customerRating, setCustomerRating] = useState(0);
  const [deliveryCondition, setDeliveryCondition] = useState('excellent');
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(selectedOrder.totalValue);
  const [customerFeedback, setCustomerFeedback] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Delivery, 2: Payment, 3: Rating

  // Delivery confirmation checklist
  const [deliveryChecklist, setDeliveryChecklist] = useState([
    { id: 1, item: 'Arrived at delivery location', checked: true },
    { id: 2, item: 'Customer identity verified', checked: false },
    { id: 3, item: 'All items delivered in good condition', checked: false },
    { id: 4, item: 'Customer signature obtained', checked: false },
    { id: 5, item: 'Photos taken for proof of delivery', checked: false },
    { id: 6, item: 'Payment collected (if COD)', checked: false },
    { id: 7, item: 'Customer rating collected', checked: false }
  ]);

  const updateChecklistItem = (id: number, checked: boolean) => {
    setDeliveryChecklist(items =>
      items.map(item =>
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const addDeliveryPhoto = () => {
    // Simulate photo capture
    const newPhoto = `/delivery-photo-${deliveryPhotos.length + 1}.jpg`;
    setDeliveryPhotos([...deliveryPhotos, newPhoto]);
    updateChecklistItem(5, true);
  };

  const handleSignatureCapture = () => {
    setCustomerSignature(true);
    updateChecklistItem(4, true);
  };

  const handleRatingChange = (rating: number) => {
    setCustomerRating(rating);
    updateChecklistItem(7, true);
  };

  const handlePaymentConfirmation = () => {
    setPaymentReceived(true);
    updateChecklistItem(6, true);
  };

  const handleCompleteDelivery = () => {
    const completionData = {
      orderId: selectedOrder.id,
      deliveryTime: selectedOrder.deliveryTime,
      customerSignature,
      deliveryPhotos,
      deliveryNotes,
      customerRating,
      deliveryCondition,
      paymentReceived,
      paymentAmount,
      customerFeedback
    };
    
    console.log('Delivery completed:', completionData);
    alert('Delivery completed successfully! Great job!');
  };

  const getCompletionPercentage = () => {
    const completedItems = deliveryChecklist.filter(item => item.checked).length;
    return Math.round((completedItems / deliveryChecklist.length) * 100);
  };

  const canCompleteDelivery = () => {
    return deliveryChecklist.slice(0, 5).every(item => item.checked) &&
           customerSignature &&
           deliveryPhotos.length >= 2 &&
           (selectedOrder.paymentMethod !== 'Cash on Delivery' || paymentReceived);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold">Delivery Confirmation</h1>
            <p className="text-sm text-green-100">{selectedOrder.id} • {selectedOrder.customerName}</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
            <div className="text-xs text-green-100">Complete</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300" 
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
      </div>

      {/* Step Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            {[
              { step: 1, label: 'Delivery', icon: Package },
              { step: 2, label: 'Payment', icon: CreditCard },
              { step: 3, label: 'Rating', icon: Star }
            ].map(({ step, label, icon: Icon }) => (
              <Button
                key={step}
                variant={currentStep === step ? "default" : currentStep > step ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentStep(step)}
                className={`flex-1 mx-1 ${
                  currentStep === step ? 'bg-blue-600' : 
                  currentStep > step ? 'bg-green-600' : ''
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-sm text-slate-600">{selectedOrder.contactPerson}</p>
                <div className="flex items-center text-sm text-slate-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  {selectedOrder.deliveryAddress}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
            
            {selectedOrder.specialInstructions && (
              <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                <div className="flex items-center mb-1">
                  <AlertCircle className="h-3 w-3 text-yellow-600 mr-1" />
                  <span className="text-xs font-medium text-yellow-800">Special Instructions</span>
                </div>
                <p className="text-xs text-yellow-700">{selectedOrder.specialInstructions}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Delivery Confirmation */}
      {currentStep === 1 && (
        <div className="space-y-4">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Package className="mr-2 h-5 w-5 text-green-600" />
                Order Items Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className={`border rounded-lg p-3 ${item.delivered ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          item.delivered ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {item.delivered ? <CheckCircle className="h-3 w-3" /> : item.id}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-slate-600">{item.quantity} • ₹{item.price}</p>
                        </div>
                      </div>
                      <Badge variant={item.condition === 'excellent' ? 'default' : 'secondary'}>
                        {item.condition}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Order Value:</span>
                  <span className="font-bold text-green-600">₹{selectedOrder.totalValue}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-slate-600">Delivery Fee:</span>
                  <span className="text-sm font-medium">₹{selectedOrder.deliveryFee}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Capture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Camera className="mr-2 h-5 w-5 text-purple-600" />
                Delivery Proof Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {deliveryPhotos.map((photo, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="h-6 w-6 text-gray-400" />
                  </div>
                ))}
                {deliveryPhotos.length < 4 && (
                  <Button
                    variant="outline"
                    className="aspect-square flex-col"
                    onClick={addDeliveryPhoto}
                  >
                    <Camera className="h-6 w-6 mb-1" />
                    <span className="text-xs">Add Photo</span>
                  </Button>
                )}
              </div>
              <p className="text-sm text-slate-600">
                Photos: {deliveryPhotos.length} / 4 (minimum 2 required)
              </p>
              
              <div className="mt-4">
                <Label htmlFor="delivery-condition">Delivery Condition</Label>
                <Select value={deliveryCondition} onValueChange={setDeliveryCondition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent - No issues</SelectItem>
                    <SelectItem value="good">Good - Minor packaging wear</SelectItem>
                    <SelectItem value="fair">Fair - Some handling marks</SelectItem>
                    <SelectItem value="damaged">Damaged - Customer notified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customer Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <PenTool className="mr-2 h-5 w-5 text-orange-600" />
                Customer Signature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
                <PenTool className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <p className="text-slate-600 mb-4">Customer signature required for delivery confirmation</p>
                <Button 
                  variant={customerSignature ? "default" : "outline"}
                  onClick={handleSignatureCapture}
                  className={customerSignature ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {customerSignature ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Signature Captured
                    </>
                  ) : (
                    <>
                      <PenTool className="mr-2 h-4 w-4" />
                      Capture Signature
                    </>
                  )}
                </Button>
              </div>
              
              {customerSignature && (
                <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    ✓ Signature captured from {selectedOrder.contactPerson}
                  </p>
                  <p className="text-xs text-green-600">
                    Time: {selectedOrder.deliveryTime} | Date: {new Date().toLocaleDateString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Delivery Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Delivery Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any notes about the delivery process, customer interaction, or special observations..."
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Payment Processing */}
      {currentStep === 2 && selectedOrder.paymentMethod === 'Cash on Delivery' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CreditCard className="mr-2 h-5 w-5 text-green-600" />
                Payment Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-slate-600">Payment Method:</span>
                  <Badge variant="outline">{selectedOrder.paymentMethod}</Badge>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Amount to Collect:</span>
                  <span className="text-2xl font-bold text-green-600">₹{selectedOrder.totalValue}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-amount">Amount Received</Label>
                  <Input
                    id="payment-amount"
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="text-lg font-bold"
                  />
                </div>

                <Button 
                  onClick={handlePaymentConfirmation}
                  className="w-full bg-green-600 hover:bg-green-700 h-12"
                  disabled={paymentAmount !== selectedOrder.totalValue}
                >
                  {paymentReceived ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Payment Confirmed
                    </>
                  ) : (
                    <>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Confirm Payment Received
                    </>
                  )}
                </Button>

                {paymentReceived && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700">
                      ✓ Payment of ₹{paymentAmount} confirmed and received
                    </p>
                    <p className="text-xs text-green-600">
                      Transaction time: {new Date().toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Customer Rating */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Star className="mr-2 h-5 w-5 text-yellow-500" />
                Customer Experience Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <p className="text-sm text-slate-600 mb-4">How would you rate this customer interaction?</p>
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      variant="ghost"
                      size="lg"
                      onClick={() => handleRatingChange(rating)}
                      className="p-2"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          rating <= customerRating 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    </Button>
                  ))}
                </div>
                {customerRating > 0 && (
                  <p className="text-sm font-medium">
                    Rating: {customerRating} star{customerRating > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer-feedback">Customer Feedback (Optional)</Label>
                  <Textarea
                    id="customer-feedback"
                    placeholder="Any feedback or comments about the customer interaction..."
                    value={customerFeedback}
                    onChange={(e) => setCustomerFeedback(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delivery Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <CheckCircle className="mr-2 h-5 w-5 text-blue-600" />
            Delivery Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deliveryChecklist.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg">
                <Checkbox
                  id={`checklist-${item.id}`}
                  checked={item.checked}
                  onCheckedChange={(checked) => updateChecklistItem(item.id, checked as boolean)}
                />
                <label htmlFor={`checklist-${item.id}`} className="text-sm flex-1">
                  {item.item}
                </label>
                {item.checked && <CheckCircle className="h-4 w-4 text-green-600" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex space-x-3 sticky bottom-20 bg-white p-4 border-t">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex-1"
          >
            Previous
          </Button>
        )}
        
        {currentStep < 3 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Next Step
          </Button>
        ) : (
          <Button
            onClick={handleCompleteDelivery}
            disabled={!canCompleteDelivery()}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <ThumbsUp className="mr-2 h-4 w-4" />
            Complete Delivery
          </Button>
        )}
      </div>

      {/* Earnings Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Delivery Completed</p>
              <p className="font-medium">{selectedOrder.customerName}</p>
              <div className="flex items-center text-xs text-slate-500 mt-1">
                <Clock className="h-3 w-3 mr-1" />
                Delivered at {selectedOrder.deliveryTime}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">₹{selectedOrder.deliveryFee}</p>
              <p className="text-xs text-slate-600">Earning</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryConfirmation;